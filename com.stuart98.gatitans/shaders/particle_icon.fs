#version 150

// textured_unlit_bgra_colorized.fs

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D Texture;

in vec2 v_TexCoord;
in vec4 v_ColorPrimary;
in vec4 v_ColorSecondary;
in float v_SelectedState;

out vec4 out_FragColor;

// lightness calculation.
float getLuma (in vec3 col)
    { return ( 0.3*col.r+0.59*col.g+0.11*col.b ); }

// blending.
// arguments: input colour, and blending colours (edges of RGB cube)
// i.e. col000 corresponds to what the black pixels turn into,
// col100 what the red pixels turn into, col101 the magenta pixels, etc...
// this function turns the input colour into a blend of the given colours
vec4 combo(in vec3 col,    in vec4 col000, in vec4 col111,
           in vec4 col100, in vec4 col010, in vec4 col001,
           in vec4 col110, in vec4 col101, in vec4 col011)
    {
    vec3 loc = vec3(1.0,1.0,1.0) - col;
    return ( col.x*col.y*col.z*col111 + col.x*col.y*loc.z*col110
           + col.x*loc.y*col.z*col101 + col.x*loc.y*loc.z*col100
           + loc.x*col.y*col.z*col011 + loc.x*col.y*loc.z*col010
           + loc.x*loc.y*col.z*col001 + loc.x*loc.y*loc.z*col000
           );
    }

vec4 LightGrey = vec4(0.66,0.66,0.66,1.0);
vec4 White = vec4(1.0,1.0,1.0,1.0);
vec4 Black = vec4(0.0,0.0,0.0,1.0);
vec4 Green = vec4(0.0,0.6,0.0,1.0);
vec4 Yellow = vec4(0.8,0.8,0,1);
    
void main() 
{
    vec4 texel = texture(Texture, v_TexCoord).bgra;
    if (v_ColorPrimary.a == 0.0)
        out_FragColor = texel;
    else
    {
        float luma = getLuma(v_ColorPrimary.rgb);
        
        vec4 border;
        vec4 pip;
        vec4 ipi;
        vec4 highlight;
        vec4 shots = vec4(0.8,0.8,0,1);

        if (luma > 0.12)
        {
            border = Black;
            pip = White;
            ipi = Black;
        }
        else
        {
            border = LightGrey;
            pip = Black;
            ipi = White;
        }
        
        if (v_SelectedState > 0.9)
            highlight = vec4(1,1,1,1);
        else
            highlight = vec4(0.0,0.0,0.0,1);

                                              // if desired, this  vvv  can be changed to v_ColorSecondary
        vec4 color = combo(texel.rgb, highlight, White, v_ColorPrimary, Green, White,Yellow,White, White);
        color.a = color.a * texel.a;
        // the above can be changed to, for instance,
        // color.a = color.a * texel.a * 0.85;
        // for transparent icons
        out_FragColor = color;
    }
}
