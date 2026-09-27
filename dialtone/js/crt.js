import * as THREE from '../../vendor/three.module.min.js';

// Same barrel warp as the shader, so mouse hits land where pixels appear.
export function crtWarp(u, v) {
  let x = u * 2 - 1, y = v * 2 - 1;
  const ox = Math.abs(y) / 5.5, oy = Math.abs(x) / 4.5;
  x += x * ox * ox; y += y * oy * oy;
  return [x * 0.5 + 0.5, y * 0.5 + 0.5];
}

export function makeCRT(canvas) {
  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.minFilter = THREE.LinearFilter; map.generateMipmaps = false;
  const mat = new THREE.ShaderMaterial({
    uniforms: { map: { value: map }, uTime: { value: 0 }, uPower: { value: 0 }, uGlitch: { value: 0 } },
    vertexShader: `varying vec2 vUv; void main(){ vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.); }`,
    fragmentShader: `
      uniform sampler2D map; uniform float uTime,uPower,uGlitch; varying vec2 vUv;
      float h(float n){ return fract(sin(n)*43758.5453); }
      vec2 warp(vec2 uv){ uv=uv*2.-1.; vec2 o=abs(uv.yx)/vec2(5.5,4.5); uv+=uv*o*o; return uv*.5+.5; }
      void main(){
        vec2 uv=warp(vUv);
        vec3 glass=vec3(.018,.02,.022)+vec3(.05)*smoothstep(.9,.2,length(vUv-vec2(.25,.8)));
        if(uv.x<0.||uv.x>1.||uv.y<0.||uv.y>1.){ gl_FragColor=vec4(glass*.6,1.); 
          #include <colorspace_fragment>
          return; }
        // power on/off: horizontal line then vertical open
        float sx=clamp(uPower*3.,0.003,1.), sy=clamp(uPower*1.6-.6,.004,1.);
        vec2 p=(uv-.5)/vec2(sx,sy)+.5;
        float row=floor(uv.y*60.);
        p.x+=(h(row+floor(uTime*24.))-.5)*uGlitch*.25;
        vec3 col=vec3(0.);
        if(p.x>=0.&&p.x<=1.&&p.y>=0.&&p.y<=1.){
          float ca=.0012+uGlitch*.02;
          col.r=texture2D(map,p+vec2(ca,0)).r; col.g=texture2D(map,p).g; col.b=texture2D(map,p-vec2(ca,0)).b;
          col+=texture2D(map,p+vec2(.004,0)).rgb*.12; // phosphor bleed
          col+= (1.-sy)*1.5*step(abs(uv.y-.5),sy*.5+.002);
        }
        float scan=.78+.22*sin(uv.y*480.*3.14159);
        float m=mod(gl_FragCoord.x,3.); vec3 mask=vec3(m<1.?1.:.82, m>=1.&&m<2.?1.:.82, m>=2.?1.:.82);
        col*=scan*mask;
        col+=uGlitch*.08*h(uv.y*800.+uTime*60.);
        vec2 vg=uv*(1.-uv); float vig=pow(vg.x*vg.y*16.,.25);
        col=col*vig*.95+glass*.5;
        col*=.97+.03*sin(uTime*120.);
        gl_FragColor=vec4(col,1.);
        #include <colorspace_fragment>
      }`,
  });
  return { mat, map };
}
