#version 150

// particle_icon.vs

#include "particle_common.vs"

out vec4 v_ColorPrimary;
out vec4 v_ColorSecondary;
out vec2 v_TexCoord;
out float v_SelectedState;

void main() 
{
    // To start with, sample the relevant data from the input stream. We need to know where in the buffer to read from.

    // The "stride" is 4, meaning we read 4 float-4s per particle.
    int stride = 4;
    int sampleBase = (gl_InstanceID * stride) + InstanceBufferParams.x;
    vec4 posAndScale = texelFetch(ParticleInstanceData, sampleBase);

    if (isIconOccluded(posAndScale.xyz))
    {
        gl_Position = vec4(0, 0, -1.0, 1.0);
        return;
    }

    vec4 vUVAndExtra = texelFetch(ParticleInstanceData, sampleBase + 1);

    v_ColorPrimary = texelFetch(ParticleInstanceData, sampleBase + 2);
    v_ColorSecondary = texelFetch(ParticleInstanceData, sampleBase + 3);

    // Get the world position...
    vec4 worldPos = WorldViewProjTransform * vec4(posAndScale.xyz, 1.0);

    // Now divide by 2 to get the normalized clip-space positions in x, y and z.
    worldPos /= worldPos.w;

    // multiply by half the screen res to get pixel offsets...
    vec2 halfScreenSize = screenSize.xy * 0.5;
    worldPos.xy *= halfScreenSize;

    // Clamp to exact pixel offset.
    worldPos.xy = floor(worldPos.xy);

    // Put back into normalized clip space.
    worldPos.xy /= halfScreenSize;

    bool b1 = (vUVAndExtra.z > 0);
    bool b2 = (posAndScale.w > 32.5);
    
    if (b1 && b2)
        v_SelectedState = 1.0;
    else if (b1)
        v_SelectedState = 0.8;
    else if (b2)
        v_SelectedState = 0.2;
    else
        v_SelectedState = 0;

    float scale = 32;

    // Now figure out the edge offset to exact pixel size.
    vec2 factor = vec2(scale / screenSize.x, scale / screenSize.y);
    vec2 quadpos = a_Position.xy * 2.0 - 1.0;
    vec2 offset = quadpos * factor;

    // We're already in normalized clip space, so w is just 1.0.
    gl_Position = vec4(worldPos.x + offset.x, worldPos.y + offset.y, worldPos.z, 1.0);

    v_TexCoord = vec2(a_TexCoord.x, vUVAndExtra.x + vUVAndExtra.y * (1.0 - a_TexCoord.y));
}
