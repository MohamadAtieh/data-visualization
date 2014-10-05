var gl;
var canvas;
var shader_program;

var projection_matrix = mat4.create();

var planet;

window.addEventListener("resize", resize);

function initialize_shaders()
{
    var vertex_shader = utils.get_shader(gl, "vertex-shader");
    var fragment_shader = utils.get_shader(gl, "fragment-shader");

    shader_program = gl.createProgram();
    gl.attachShader(shader_program, vertex_shader);
    gl.attachShader(shader_program, fragment_shader);
    gl.linkProgram(shader_program);

    if (!gl.getProgramParameter(shader_program, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shader_program);

    shader_program.vertexPositionAttribute = gl.getAttribLocation(shader_program, "position");
    gl.enableVertexAttribArray(shader_program.vertexPositionAttribute);

    shader_program.pMatrixUniform = gl.getUniformLocation(shader_program, "projection_matrix");
    shader_program.mvMatrixUniform = gl.getUniformLocation(shader_program, "modelview_matrix");
}


function resize()
{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
    mat4.perspective(projection_matrix, 45, canvas.width / canvas.height, 0.1, 100.0);
}


function initialize()
{
    canvas = document.getElementById("canvas");

    try {
        gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    } catch(e) {
        if (!gl) {
            alert("Could not initialize WebGL");
        }
    }

    initialize_shaders();
    planet = new Planet(0.8);

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    resize();
}


function update() 
{
    planet.update();
}


function render()
{
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    planet.render(shader_program, projection_matrix);
}


function tick()
{
    requestAnimFrame(tick);
    update();
    render();
}


function execute()
{
    initialize();
    tick();
}
