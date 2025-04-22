<script>
    import { onMount } from 'svelte';

    // --- WebGL Real-Time Dot Time Display ---
    const shader = {
        vertexSource: `
            attribute vec4 a_position;
            void main() {
                gl_Position = a_position;
            }
        `,
        fragmentSource: `
            precision mediump float;
            uniform float u_time;
            uniform vec2 u_resolution;
            uniform float u_seconds;
            uniform float u_minutes;
            uniform float u_hours6;

            const float PI = 3.1415926535897932384626433832795;

            // Colors
            vec3 purple = vec3(0.6, 0.2, 0.8);
            vec3 red = vec3(0.8, 0.2, 0.2);
            vec3 yellow = vec3(0.9, 0.9, 0.2);
            vec3 background = vec3(0.15);

            void main() {
                vec2 uv = gl_FragCoord.xy / u_resolution.xy;
                vec3 col = background;
                float dotRadius = 0.02;
                float gridSpacingX = 0.2;
                float gridSpacingY = 0.2;
                vec2 gridOffset = vec2(0.3, 0.3);

                // Hour Dots (Purple) - 2x3 grid
                for (int y = 0; y < 2; y++) {
                    for (int x = 0; x < 3; x++) {
                        float dotX = gridOffset.x + float(x) * gridSpacingX;
                        float dotY = gridOffset.y + float(y) * gridSpacingY;
                        vec2 dotPos = vec2(dotX, dotY);
                        float dist = distance(uv, dotPos);
                        float targetHour = floor(u_hours6); // Integer part of 6-hour cycle
                        float dotIndex = float(y * 3 + x);
                        if (floor(dotIndex) == floor(targetHour)) {
                            if (dist < dotRadius) col = purple;
                        }
                    }
                }

                // Minute Dot (Red) - Horizontal movement
                float minuteNormalized = u_minutes / 60.0;
                float minuteX = gridOffset.x + minuteNormalized * 2.0 * gridSpacingX; // Move across the middle 2 columns
                vec2 minutePos = vec2(minuteX, gridOffset.y + 0.5 * gridSpacingY);
                float minuteDist = distance(uv, minutePos);
                if (minuteDist < dotRadius * 0.8) col = red;

                // Second Dot (Yellow) - Horizontal movement along a path
                float secondNormalized = u_seconds / 60.0; // 0 to 1 for seconds
                float secondX = gridOffset.x + secondNormalized * 2.0 * gridSpacingX; // Move across the 3 columns
                vec2 secondPos = vec2(secondX, gridOffset.y + 1.5 * gridSpacingY);
                float secondDist = distance(uv, secondPos);
                if (secondDist < dotRadius * 0.6) col = yellow;

                // Make the second dot pulse slightly to highlight the tick
                float pulse = 0.8 + 0.2 * sin(u_seconds * PI * 2.0 * 2.0); // Faster pulse
                if (secondDist < dotRadius * 0.6) col *= pulse;

                gl_FragColor = vec4(col, 1.0);
            }
        `,
        init: (gl) => {
            const vertexShader = createShader(gl, gl.VERTEX_SHADER, shader.vertexSource);
            if (!vertexShader) return null;

            const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, shader.fragmentSource);
            if (!fragmentShader) return null;

            const program = gl.createProgram();
            if (!program) return null;

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);
            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.error('Error linking shader program:', gl.getProgramInfoLog(program));
                gl.deleteProgram(program);
                return null;
            }

            gl.useProgram(program);
            return program;
        },
        setupGeometry: (gl, program) => {
            const positionBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
            const positions = [
                -1, -1,
                 1, -1,
                -1,  1,
                -1,  1,
                 1, -1,
                 1,  1,
            ];
            gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

            const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
            gl.enableVertexAttribArray(positionAttributeLocation);
            gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);
        },
        getUniformLocations: (gl, program) => ({
            time: gl.getUniformLocation(program, 'u_time'),
            resolution: gl.getUniformLocation(program, 'u_resolution'),
            seconds: gl.getUniformLocation(program, 'u_seconds'),
            minutes: gl.getUniformLocation(program, 'u_minutes'),
            hours6: gl.getUniformLocation(program, 'u_hours6'),
        }),
        render: (gl, program, uniforms, now) => {
            const nowInSeconds = now * 0.001; // Convert milliseconds to seconds
            const date = new Date();
            // Adjust for Rotterdam time (UTC+1 + DST)
            const offsetMs = date.getTimezoneOffset() * 60 * 1000; // Local timezone offset in milliseconds
            const utcMs = date.getTime() + offsetMs;
            const rotterdamOffsetMs = 2 * 60 * 60 * 1000; // +2 hours for Rotterdam (DST might be active)
            const rotterdamMs = utcMs + rotterdamOffsetMs;
            const rotterdamDate = new Date(rotterdamMs);

            const seconds = rotterdamDate.getSeconds();
            const minutes = rotterdamDate.getMinutes();
            const hours12 = rotterdamDate.getHours() % 12; // 12-hour format
            const hours6 = Math.floor(rotterdamDate.getHours() / 2) % 6; // 6-hour cycle

            gl.uniform1f(uniforms.time, nowInSeconds);
            gl.uniform1f(uniforms.seconds, seconds);
            gl.uniform1f(uniforms.minutes, minutes);
            gl.uniform1f(uniforms.hours6, hours6);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        },
        resize: (gl, uniforms) => {
            if (gl.canvas.width !== gl.canvas.offsetWidth || gl.canvas.height !== gl.canvas.offsetHeight) {
                gl.canvas.width = gl.canvas.offsetWidth;
                gl.canvas.height = gl.canvas.offsetHeight;
                gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
                gl.uniform2f(uniforms.resolution, gl.canvas.width, gl.canvas.height);
            }
        }
    };

    function createShader(gl, type, source) {
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            console.error('An error occurred compiling the shader:');
            console.error(gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }

    onMount(() => {
        const canvas = document.getElementById('shaderCanvas');
        if (canvas) {
            const gl = canvas.getContext('webgl');
            if (!gl) return;

            const program = shader.init(gl);
            if (program) {
                shader.setupGeometry(gl, program);
                const uniforms = shader.getUniformLocations(gl, program);

                function render(now) {
                    requestAnimationFrame(render);
                    shader.resize(gl, uniforms);
                    shader.render(gl, program, uniforms, now);
                }

                render(0);
            }
        }
    });
</script>

<style>
    .shader-container {
        width: 100%;
        max-width: 400px;
        height: 150px;
        margin-top: 40px;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
    }

    .shader-container canvas {
        display: block;
        width: 100%;
        height: 100%;
    }
</style>

<div class="shader-container">
    <canvas id="shaderCanvas"></canvas>
</div>