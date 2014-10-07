var gl;
var canvas;
var shader_program;

var projection_matrix = mat4.create();
var view_matrix = mat4.create();

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

    shader_program.position = gl.getAttribLocation(shader_program, "position");
    gl.enableVertexAttribArray(shader_program.position);

    shader_program.normal = gl.getAttribLocation(shader_program, "normal");
    gl.enableVertexAttribArray(shader_program.normal);

    shader_program.projection_matrix = gl.getUniformLocation(shader_program, "projection_matrix");
    shader_program.view_matrix = gl.getUniformLocation(shader_program, "view_matrix");
    shader_program.model_matrix = gl.getUniformLocation(shader_program, "model_matrix");

    shader_program.normal_matrix = gl.getUniformLocation(shader_program, "normal_matrix");

    shader_program.ambient_color = gl.getUniformLocation(shader_program, "ambient_color");

    shader_program.lighting_direction = gl.getUniformLocation(shader_program, "lighting_direction");
    shader_program.directional_color = gl.getUniformLocation(shader_program, "directional_color");

    shader_program.use_lighting = gl.getUniformLocation(shader_program, "use_lighting");
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
    mat4.translate(view_matrix, view_matrix, [0.0, 0.0, -3.0]);

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
    gl.useProgram(shader_program);
    gl.uniformMatrix4fv(shader_program.view_matrix, false, view_matrix);
    planet.render(shader_program, projection_matrix);
    gl.useProgram(null);
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
