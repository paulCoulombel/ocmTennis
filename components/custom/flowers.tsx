import { useEffect, useRef } from "react";
import * as THREE from "three";
// cspell: disable

export const vertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

export const fragmentShader = /* glsl */ `
#define PI 3.14159265359

uniform float u_ratio;
uniform vec2 u_cursor;
uniform float u_stop_time;
uniform float u_clean;
uniform vec2 u_stop_randomizer;
uniform float u_scale;

uniform sampler2D u_texture;
varying vec2 vUv;

// ---- noise helpers ----
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(
    0.211324865405187,
    0.366025403784439,
   -0.577350269189626,
    0.024390243902439
  );
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1., 0.) : vec2(0., 1.);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(
    permute(i.y + vec3(0., i1.y, 1.)) +
    i.x + vec3(0., i1.x, 1.)
  );
  vec3 m = max(
    0.5 - vec3(
      dot(x0, x0),
      dot(x12.xy, x12.xy),
      dot(x12.zw, x12.zw)
    ), 
    0.0
  );
  m = m*m;
  m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}
  float get_stem_shape(vec2 _p, vec2 _uv, float _w, float _angle) {

    _w = max(.004, _w);

    float x_offset = _p.y * sin(_angle);
    x_offset *= pow(3. * _uv.y, 2.);
    _p.x -= x_offset;

    float noise_power = .5;
    float cursor_horizontal_noise =
        noise_power * snoise(2. * _uv * u_stop_randomizer[0]);

    cursor_horizontal_noise *= pow(dot(_p.y, _p.y), .6);
    cursor_horizontal_noise *= pow(dot(_uv.y, _uv.y), .3);

    _p.x += cursor_horizontal_noise;

    float left = smoothstep(-_w, 0., _p.x);
    float right = 1. - smoothstep(0., _w, _p.x);
    float stem_shape = left * right;

    float grow_time = 1. - smoothstep(0., .2, u_stop_time);
    float stem_top_mask =
        smoothstep(0., pow(grow_time, .5), .03 - _p.y);

    stem_shape *= stem_top_mask;
    stem_shape *= (1. - step(.17, u_stop_time));

    return stem_shape;
}
float get_flower_shape(
    vec2 _p,
    float _pet_n,
    float _angle,
    float _outline
) {
    _angle *= 3.;

    _p = vec2(
        _p.x * cos(_angle) - _p.y * sin(_angle),
        _p.x * sin(_angle) + _p.y * cos(_angle)
    );

    float a = atan(_p.y, _p.x);
    float flower_sectoral_shape =
        pow(abs(sin(a * _pet_n)), .4) + .25;

    vec2 flower_size_range = vec2(.06, .1);
    float size =
        flower_size_range[0] +
        u_stop_randomizer[0] * flower_size_range[1];

    float flower_radial_shape =
        pow(length(_p) / size, 2.);

    flower_radial_shape -= .1 * sin(8. * a);
    flower_radial_shape = max(.1, flower_radial_shape);

    flower_radial_shape +=
        smoothstep(0., 0.03, -_p.y + .2 * abs(_p.x));

    float grow_time =
        step(.25, u_stop_time) * pow(u_stop_time, .3);

    float flower_shape =
        1. - smoothstep(
            0.,
            flower_sectoral_shape,
            _outline * flower_radial_shape / grow_time
        );

    flower_shape *= (1. - step(1., grow_time));

    return flower_shape;
}

void main() {

    vec4 baseTexture = texture2D(u_texture, vUv);
    vec3 base = baseTexture.xyz;
    float baseAlpha = baseTexture.a;

    vec2 uv = vUv;
    uv.x *= u_ratio;
    vec2 cursor = vUv - u_cursor.xy;
    cursor.x *= u_ratio;
    uv *= u_scale;
    cursor *= u_scale;
    
    vec3 stem_color = vec3(.1 + u_stop_randomizer[0] * .6, .6, .2);
    vec3 flower_color = vec3(.6 + .5 * u_stop_randomizer[1], .1, .9 - .5 * u_stop_randomizer[1]);

    float angle = .5 * (u_stop_randomizer[0] - .5);

    float stem_shape = get_stem_shape(cursor, uv, .006, angle);
    stem_shape += get_stem_shape(cursor + vec2(0., .2 + .5 * u_stop_randomizer[0]), uv, .006, angle);

    float stem_mask = 1. - get_stem_shape(cursor, uv, .008, angle);
    stem_mask -= get_stem_shape(cursor + vec2(0., .2 + .5 * u_stop_randomizer[0]), uv, .008, angle);

    float petals_back_number = 1. + floor(u_stop_randomizer[0] * 2.);
    float angle_offset = -(2. * step(0., angle) - 1.) * .1 * u_stop_time;

    float flower_back_shape =
        get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.5);
    float flower_back_mask =
        1. - get_flower_shape(cursor, petals_back_number, angle + angle_offset, 1.6);

    float petals_front_number = 2. + floor(u_stop_randomizer[1] * 2.);
    float flower_front_shape =
        get_flower_shape(cursor, petals_front_number, angle, 1.);
    float flower_front_mask =
        1. - get_flower_shape(cursor, petals_front_number, angle, .95);

    vec3 color = base;
    color *= stem_mask;
    color *= flower_back_mask;
    color *= flower_front_mask;

    color += stem_shape * stem_color;
    color += flower_back_shape * (flower_color + vec3(0., .8 * u_stop_time, 0.));
    color += flower_front_shape * flower_color;

    color.r *= 1. - (.5 * flower_back_shape * flower_front_shape);
    color.b *= 1. - (flower_back_shape * flower_front_shape);

    color *= u_clean;

    float isFlowerPixel = max(stem_shape, max(flower_back_shape, flower_front_shape));
    
    // Si le pixel est complètement vide (pas de fleur et pas d'ancien contenu), on le rend transparent
    if (isFlowerPixel < 0.01 && baseAlpha < 0.01) {
        discard;
    }
    
    float alpha = step(0.01, isFlowerPixel) * u_clean;
    alpha = max(alpha, baseAlpha); // Conserver l'alpha précédent

    gl_FragColor = vec4(color, alpha);
}
`;
// cspell: enable

export function FlowerCanvas({
  firstFlowersPointer,
  flowerScale,
  canvasId,
}: {
  firstFlowersPointer: { x: number; y: number }[];
  flowerScale: number;
  canvasId?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    canvas.style.background = "transparent";
    const pointer = {
      x: firstFlowersPointer[0].x,
      y: firstFlowersPointer[0].y,
      clicked: true,
      vanishCanvas: false,
    };

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      premultipliedAlpha: false,
      antialias: true,
      preserveDrawingBuffer: true,
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const sceneShader = new THREE.Scene();
    const sceneBasic = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 10);
    const clock = new THREE.Clock();

    const renderTargets = [
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      }),
      new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight, {
        format: THREE.RGBAFormat,
        type: THREE.UnsignedByteType,
      }),
    ];

    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_stop_time: { value: 0 },
        u_stop_randomizer: {
          value: new THREE.Vector2(Math.random(), Math.random()),
        },
        u_cursor: { value: new THREE.Vector2(pointer.x, pointer.y) },
        u_ratio: { value: window.innerWidth / window.innerHeight },
        u_texture: { value: null },
        u_clean: { value: 1 },
        u_scale: { value: 1 / flowerScale }, // Adjust scale based on prop
      },
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      blending: THREE.NormalBlending,
      depthWrite: false,
    });

    const basicMaterial = new THREE.MeshBasicMaterial({
      transparent: true,
      alphaTest: 0.01,
      blending: THREE.NormalBlending,
    });
    const geometry = new THREE.PlaneGeometry(2, 2);

    sceneShader.add(new THREE.Mesh(geometry, shaderMaterial));
    sceneBasic.add(new THREE.Mesh(geometry, basicMaterial));

    function resize() {
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
      shaderMaterial.uniforms.u_ratio.value =
        canvas.clientWidth / canvas.clientHeight;
    }
    let lastClickTime = new Date().getTime() + 500;
    let indexFirstFlowersDisplayed = 1;

    function render() {
      shaderMaterial.uniforms.u_clean.value = pointer.vanishCanvas ? 0 : 1;
      shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;
      if (pointer.clicked && new Date().getTime() - lastClickTime > 500) {
        shaderMaterial.uniforms.u_cursor.value.set(pointer.x, 1 - pointer.y);
        shaderMaterial.uniforms.u_scale.value =
          (1 / flowerScale) * pointer.y ** 0.5; // Taller flowers = bigger flower
        shaderMaterial.uniforms.u_stop_time.value = 0;
        pointer.clicked = false;
        lastClickTime = new Date().getTime();
      }
      if (
        indexFirstFlowersDisplayed < firstFlowersPointer.length &&
        new Date().getTime() - lastClickTime > 500
      ) {
        shaderMaterial.uniforms.u_cursor.value.set(
          firstFlowersPointer[indexFirstFlowersDisplayed].x,
          1 - firstFlowersPointer[indexFirstFlowersDisplayed].y,
        );
        shaderMaterial.uniforms.u_scale.value =
          (1 / flowerScale) *
          firstFlowersPointer[indexFirstFlowersDisplayed].y ** 0.5;
        shaderMaterial.uniforms.u_stop_time.value = 0;
        lastClickTime = new Date().getTime();
        indexFirstFlowersDisplayed++;
      }
      shaderMaterial.uniforms.u_stop_time.value += clock.getDelta();

      shaderMaterial.uniforms.u_texture.value = renderTargets[0].texture;

      renderer.setRenderTarget(renderTargets[1]);
      renderer.clear();
      renderer.render(sceneShader, camera);

      basicMaterial.map = renderTargets[1].texture;
      renderer.setRenderTarget(null);
      renderer.render(sceneBasic, camera);

      [renderTargets[0], renderTargets[1]] = [
        renderTargets[1],
        renderTargets[0],
      ];

      requestAnimationFrame(render);
    }

    const onClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = (e.clientX - rect.left) / rect.width;
      pointer.y = (e.clientY - rect.top) / rect.height;
      pointer.clicked = true;
    };

    canvas.addEventListener("click", onClick);
    window.addEventListener("resize", resize);

    const launch = async () => {
      await new Promise((resolve) => setTimeout(resolve, 2500));
      resize();
      render();
    };
    launch();

    return () => {
      canvas.removeEventListener("click", onClick);
      window.removeEventListener("resize", resize);
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      id={canvasId}
      className="absolute bg-transparent inset-0 w-full h-full z-5"
    />
  );
}
