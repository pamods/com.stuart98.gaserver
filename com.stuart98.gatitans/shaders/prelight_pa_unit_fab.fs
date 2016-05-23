#version 140

// prelight_pa_unit_fab.fs

#include "prelight_include.fs"
#include "noise4d.glsl"

uniform vec4 GBufferDepth_range;

uniform vec3 TeamColor_Primary;
uniform vec3 TeamColor_Secondary;
uniform vec4 BuildInfo; // vec4(frac,age,radius,height)
uniform vec4 BuildInfo2;

uniform sampler2D DiffuseTexture;
uniform sampler2D MaterialTexture;
uniform sampler2D MaskTexture;
uniform sampler2D NoiseTexture;

in vec2 v_TexCoord;
in vec3 v_Forward;
in vec3 v_Normal;
in vec3 v_ModelPosition;

out vec4 out_FragData[4];

void main() 
{
    vec2 tc = v_TexCoord;
    vec4 diffuse_raw = texture(DiffuseTexture, tc);
    vec4 material_raw = texture(MaterialTexture, tc);

    float build_fraction = BuildInfo.x;
    float wire_width = BuildInfo.y;
    float model_height = BuildInfo.w;
    float model_radius = BuildInfo.z;

    float metal_cost_mod = BuildInfo2.x;

    // distance field * "size" to approximate world scale distance field
    float wire_distfield = (0.9864 - diffuse_raw.a) * wire_width * 0.25;

    float height_fraction = v_ModelPosition.z / model_height + (texture(NoiseTexture, v_ModelPosition.xy / 80.0 + build_fraction).r + texture(NoiseTexture, v_ModelPosition.xy / -90.0 + build_fraction).g) * 0.02;

    vec3 radius_scaled = v_ModelPosition / model_radius;
    float radial_fraction = dot(radius_scaled, radius_scaled);

    float metal_cost_mod_timer_offset = max(metal_cost_mod * 0.1, 10.0);
    float wire_timer = build_fraction * metal_cost_mod_timer_offset;
    float wire_min_scale = abs(v_Forward.z) / 1200.0; // This is a horrible magic number, should be screen pixel width

    float build_mask = clamp((height_fraction - (build_fraction - 0.5) * 2.0) * 1000.0, 0.0, 1.0);

    if( radial_fraction > wire_timer && build_mask > 0.0 )
    {
        discard;
    }

    // end of fab process, should be it's own var or encoded in to build_fraction > 1.0
    float fab_fade = clamp((1.0 - build_fraction) * 7.0, 0.0, 1.0);

    float wirefill_timer = 1.0 - (build_fraction - 1.0 / metal_cost_mod_timer_offset) * 10.0;
    float wire_anim = pow(snoise(vec4(v_ModelPosition.x / 12.0, v_ModelPosition.y / 12.0, v_ModelPosition.z / 12.0, build_fraction * 5.0)), 1.0) * fab_fade;

    if( wire_distfield > max(0.15 * wire_anim, wire_min_scale) && radial_fraction < wirefill_timer && build_mask > 0.0 )
    {
        discard;
    }

    float fab_mask = clamp((height_fraction - (build_fraction - 0.5) * 2.0 - 0.75 / model_height) * 1000.0, 0.0, 1.0);
    fab_mask = build_mask * (1.0 - fab_mask);

    

    float wire_prefab_scale = 0.15 / clamp(pow(radial_fraction - wirefill_timer - 0.01, 0.5), 0.01, 1.0);
    float wire_postfab_scale = 0.025;
    float wire_hide_scale = 0.0;
    float wire_fab_scale = mix(wire_postfab_scale, wire_prefab_scale, build_mask) * wire_anim;
    float wire_scale = mix(wire_hide_scale, wire_fab_scale, fab_fade);
    float wire_subpixel_fade = clamp(wire_scale / (wire_min_scale * 0.25), 0.0, 1.0);
    float wire_scale_clamped = max(wire_scale, wire_min_scale * 0.25);

    float wire_mask_raw = wire_distfield - wire_scale_clamped;
    float wire_mask = 1.0 - (1.0 - clamp( wire_mask_raw / wire_min_scale, 0.0, 1.0)) * wire_subpixel_fade;


    float wire_fab_scale2 = mix(wire_postfab_scale, wire_prefab_scale, build_mask) * (1.0 - wire_anim);
    float wire_scale2 = mix(wire_hide_scale, wire_fab_scale2, fab_fade);
    float wire_subpixel_fade2 = clamp(wire_scale2 / (wire_min_scale * 0.25), 0.0, 1.0);
    float wire_scale_clamped2 = max(wire_scale2, wire_min_scale * 0.25);

    float wire_mask_raw2 = wire_distfield - wire_scale_clamped2;
    float wire_mask2 = 1.0 - (1.0 - clamp( wire_mask_raw2 / wire_min_scale, 0.0, 1.0)) * wire_subpixel_fade2;

    vec3 build_color = TeamColor_Primary.xyz;
    vec3 fab_color = vec3(0.2, 10.0, 0.05);

    vec4 mask = texture(MaskTexture, tc);
    vec3 viewNormal = normalize(v_Normal);


    // Mix team color - fast & cheap photoshop overlay
    vec3 teamColor = mix(vec3(0.5,0.5,0.5), TeamColor_Secondary, mask.g);
    teamColor = mix(teamColor, TeamColor_Primary, mask.r);
    vec3 team_overlay_mult = clamp(2.0 * diffuse_raw.rgb, 0.0, 1.0);
    vec3 team_overlay_screen = 1.0 - 2.0 * (1.0 - clamp(diffuse_raw.rgb, 0.5, 1.0)) * (1.0 - teamColor);
    vec3 diffuse = team_overlay_mult * team_overlay_screen;


    diffuse = mix(diffuse, build_color * 0.25, build_mask);

    vec2 material_mixed = mix(material_raw.rg, vec2(0.0, 0.0), build_mask * wire_mask);
    float specularMask = material_mixed.r;
    float specularExp = material_mixed.g;
    float specularMetal = material_raw.b;
    float emissive_mask = mask.b;

    vec3 ambientColor = calcAmbient(viewNormal, v_Forward);
    vec3 ambient = ambientColor * diffuse.rgb + diffuse.rgb * 2.0 * (1.0 - fab_fade) * emissive_mask * (1.0 - build_mask);
    ambient = mix(ambient, build_color, (1.0 - wire_mask2) * build_mask);
    ambient = mix(ambient, fab_color, (1.0 - wire_mask) * (0.01 + 0.99 * build_mask));
    ambient = mix(ambient, fab_color, fab_mask);

    out_FragData[0] = vec4(ambient, 1.0);
    out_FragData[1] = vec4(diffuse.rgb, specularMask);
    out_FragData[2] = vec4(length(v_Forward) * GBufferDepth_range.z - GBufferDepth_range.w, 0.0, 0.0, 1.0);
    out_FragData[3] = vec4(encodeViewNormal(viewNormal), encodeSpecularExp(specularExp, specularMetal));
}
