function main(){
    /** @type {HTMLCanvasElement} */
    var canvas = document.getElementById('myCanvas');
    /** @type {WebGLRenderingContext} */
    var gl = canvas.getContext('webgl');

    var glass_1 = [];

    for(var i = 0; i<=180; i+=1)
    {
        var j = (i + 270) * Math.PI / 180;
        var k = (i+271) * Math.PI / 180;
        var vert1 = [
            Math.sin(j) * 0.175 - 0.5 , Math.cos(j) * 0.05 + 0.5, 0.701, 0.922, 0.541,
        ];
    
        var vert2 = [
            -0.5, 0.4, 0.701, 0.922, 0.541,
        ];

        var vert3 = [
            Math.sin(k) * 0.175 - 0.5 , Math.cos(k) * 0.05 + 0.5, 0.701, 0.922, 0.541,
        ];

        glass_1 = glass_1.concat(vert1);
        glass_1 = glass_1.concat(vert2);
        glass_1 = glass_1.concat(vert3);
    }

    for(var i = 90; i<=270; i+=1)
    {
        var j = i * Math.PI / 180;
        var k = (i+1) * Math.PI / 180;
        var vert1 = [
            Math.sin(j) * 0.125 - 0.5 , Math.cos(j) * 0.1 - 0.5, 0.701, 0.922, 0.541,
        ];

        var vert2 = [
            -0.5, -0.5, 0.701, 0.922, 0.541,
        ];

        var vert3 = [
            Math.sin(k) * 0.125 - 0.5 , Math.cos(k) * 0.1 - 0.5, 0.701, 0.922, 0.541,
        ];

        glass_1 = glass_1.concat(vert1);
        glass_1 = glass_1.concat(vert2);
        glass_1 = glass_1.concat(vert3);
    }
    
    var A = glass_1.slice(180*5*3, 180*5*3+5);
    var B = glass_1.slice(181*5*3, 181*5*3+5);
    var C = glass_1.slice(361*5*3, 361*5*3+5);
    var D = glass_1.slice(0*5*3, 0*5*3+5);

    glass_1 = glass_1.concat(A);
    glass_1 = glass_1.concat(B);
    glass_1 = glass_1.concat(C);
    glass_1 = glass_1.concat(C);
    glass_1 = glass_1.concat(D);
    glass_1 = glass_1.concat(A);

    var glass_2 = [];

    for(var i = 0; i<=180; i+=1)
    {
        var j = (i + 270) * Math.PI / 180;
        var k = (i+271) * Math.PI / 180;
        var vert1 = [
            Math.sin(j) * 0.2 + 0.5 , Math.cos(j) * 0.2 + 0.4, 0.486, 0.627, 0.384,
        ];

        var vert2 = [
            0.5, 0.4, 0.486, 0.627, 0.384,
        ];

        var vert3 = [
            Math.sin(k) * 0.2 + 0.5 , Math.cos(k) * 0.2 + 0.4, 0.486, 0.627, 0.384,
        ];

        glass_2 = glass_2.concat(vert1);
        glass_2 = glass_2.concat(vert2);
        glass_2 = glass_2.concat(vert3);
    }

    for(var i = 90; i<=270; i+=1)
    {
        var j = i * Math.PI / 180;
        var k = (i+1) * Math.PI / 180;
        var vert1 = [
            Math.sin(j) * 0.125 + 0.5 , Math.cos(j) * 0.1 - 0.5, 0.701, 0.922, 0.541,
        ];

        var vert2 = [
            0.5, -0.5, 0.701, 0.922, 0.541,
        ];

        var vert3 = [
            Math.sin(k) * 0.125 + 0.5 , Math.cos(k) * 0.1 - 0.5, 0.701, 0.922, 0.541,
        ];

        glass_2 = glass_2.concat(vert1);
        glass_2 = glass_2.concat(vert2);
        glass_2 = glass_2.concat(vert3);
    }
    
    var A = glass_2.slice(180*5*3, 180*5*3+2);
    A = A.concat([0.701, 0.922, 0.541,]);
    var B = glass_2.slice(181*5*3, 181*5*3+5);
    var C = glass_2.slice(361*5*3, 361*5*3+5);
    var D = glass_2.slice(0*5*3, 0*5*3+2);
    D = D.concat([0.701, 0.922, 0.541,]);

    glass_2 = glass_2.concat(A);
    glass_2 = glass_2.concat(B);
    glass_2 = glass_2.concat(C);
    glass_2 = glass_2.concat(C);
    glass_2 = glass_2.concat(D);
    glass_2 = glass_2.concat(A);

    for(var i = 0; i<=180; i+=1)
    {
        var j = (i + 90) * Math.PI / 180;
        var k = (i+91) * Math.PI / 180;
        var vert1 = [
            Math.sin(j) * 0.2 + 0.5 , Math.cos(j) * 0.2 + 0.4, 0.486, 0.627, 0.384,
        ];

        var vert2 = [
            0.5, 0.4, 0.486, 0.627, 0.384,
        ];

        var vert3 = [
            Math.sin(k) * 0.2 + 0.5 , Math.cos(k) * 0.2 + 0.4, 0.486, 0.627, 0.384,
        ];

        glass_2 = glass_2.concat(vert1);
        glass_2 = glass_2.concat(vert2);
        glass_2 = glass_2.concat(vert3);
    }

    var vertices = [...glass_1, ...glass_2]
    var glass_1_len = glass_1.length / 5;
    var glass_2_len = glass_2.length / 5;

    var buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    var vertexShaderCode = `
    attribute vec2 aPosition;
    attribute vec3 aColor;
    varying vec3 vColor;
    uniform mat4 u_matrix;

    void main(){
        gl_Position = u_matrix * vec4(aPosition, 0, 1);
        vColor = aColor;
    }`;

    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderCode);
    gl.compileShader(vertexShader);

    var compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if (!compiled) {
        console.error(gl.getShaderInfoLog(vertexShader));
    }

    var fragmentShaderCode = `
    precision mediump float;
    varying vec3 vColor;

    void main(){
        gl_FragColor = vec4(vColor, 1.0);
    }
    `;

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentShaderCode);
    gl.compileShader(fragmentShader);

    compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if (!compiled) {
        console.error(gl.getShaderInfoLog(fragmentShader));
    }

    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);


    var linked = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
    if (!linked) {
        console.error(gl.getProgramInfoLog(shaderProgram));
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    var aPosition = gl.getAttribLocation(shaderProgram, `aPosition`);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 0);
    gl.enableVertexAttribArray(aPosition);

    var aColor = gl.getAttribLocation(shaderProgram, `aColor`);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 5*Float32Array.BYTES_PER_ELEMENT, 2*Float32Array.BYTES_PER_ELEMENT);
    gl.enableVertexAttribArray(aColor);

    
    let change = 0;
    let speed = 0.0031;
    function drawScene() {
        if(change >= 0.4 || change <=-0.4) speed = -speed;
        change += speed;
        gl.useProgram(shaderProgram);
        const leftObject = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, 0.0, 0.0, 1.0,
        ]
        
        const rightObject = [
            1.0, 0.0, 0.0, 0.0,
            0.0, 1.0, 0.0, 0.0,
            0.0, 0.0, 1.0, 0.0,
            0.0, change, 0.0, 1.0,
        ]
        
        gl.clearColor(0.0, 0.0, 0.0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

        const u_matrix = gl.getUniformLocation(shaderProgram, 'u_matrix');
        gl.uniformMatrix4fv(u_matrix, false, leftObject);
    
        gl.drawArrays(gl.TRIANGLES, 0, glass_1_len);
        
        gl.uniformMatrix4fv(u_matrix, false, rightObject);
        gl.drawArrays(gl.TRIANGLES, glass_1_len, glass_2_len);
        requestAnimationFrame(drawScene);
    }

    drawScene();
}