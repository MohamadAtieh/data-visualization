Planet.prototype.generate_mesh = function(n_longitude_bands, n_latitude_bands)
{
    this.vertex_position_data = [];
    this.normal_data = [];
    for (var i = 0; i <= n_latitude_bands; i++) {
        var theta = i * Math.PI / n_latitude_bands;
        var sin_theta = Math.sin(theta);
        var cos_theta = Math.cos(theta);

        for (var j = 0; j <= n_longitude_bands; j++) {
            var phi = j * 2 * Math.PI / n_longitude_bands;
            var sin_phi = Math.sin(phi);
            var cos_phi = Math.cos(phi);

            var x = cos_phi * sin_theta;
            var y = cos_theta;
            var z = sin_phi * sin_theta;
            var u = 1 - (j / n_longitude_bands);
            var v = 1 - (i / n_latitude_bands);

            this.normal_data.push(x);
            this.normal_data.push(y);
            this.normal_data.push(z);

            this.vertex_position_data.push(this.radius * x);
            this.vertex_position_data.push(this.radius * y);
            this.vertex_position_data.push(this.radius * z);
        }
    }

    this.index_data = [];
    for (var i = 0; i < n_latitude_bands; i++) {
        for (var j = 0; j < n_longitude_bands; j++) {
            var first = (i * (n_longitude_bands + 1)) + j;
            var second = first + n_longitude_bands + 1;
            this.index_data.push(first);
            this.index_data.push(second);
            this.index_data.push(first + 1);

            this.index_data.push(second);
            this.index_data.push(second + 1);
            this.index_data.push(first + 1);
        }
    }
}


function Planet(radius)
{
    this.radius = radius;
    this.generate_mesh(30, 30);
    this.model_matrix = mat4.create();

    // Position
    this.planet_vertex_position_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.planet_vertex_position_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertex_position_data), gl.STATIC_DRAW);
    this.planet_vertex_position_buffer.item_size = 3;
    this.planet_vertex_position_buffer.n_items = this.vertex_position_data / 3;

    // Normal
    this.planet_vertex_normal_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.planet_vertex_normal_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normal_data), gl.STATIC_DRAW);
    this.planet_vertex_normal_buffer.item_size = 3;
    this.planet_vertex_normal_buffer.n_items = this.normal_data.length / 3;

    // Index
    this.planet_vertex_index_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.planet_vertex_index_buffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.index_data), gl.STATIC_DRAW);
    this.planet_vertex_index_buffer.item_size = 1;
    this.planet_vertex_index_buffer.n_items = this.index_data.length;
}


Planet.prototype.update = function()
{
    mat4.rotate(this.model_matrix, this.model_matrix, 0.1, [0.0, 1.0, 0.0]);
} 


Planet.prototype.render = function(shader_program, projection_matrix)
{
    gl.useProgram(shader_program);

    var lighting = document.getElementById("lighting").checked;
    gl.uniform1i(shader_program.use_lighting, lighting);
    if (lighting) {
        gl.uniform3f(shader_program.ambient_color, 0.2, 0.2, 0.2);

        var lighting_direction = [-1.0, -1.0, -1.0];

        var adjusted_lighting_direction = vec3.create();
        vec3.normalize(adjusted_lighting_direction, lighting_direction);
        vec3.scale(adjusted_lighting_direction, adjusted_lighting_direction, -1);
        gl.uniform3fv(shader_program.lighting_direction, adjusted_lighting_direction);

        gl.uniform3f(shader_program.directional_color, 0.7, 0.7, 0.7);
    }

    // Position
    gl.bindBuffer(gl.ARRAY_BUFFER, this.planet_vertex_position_buffer);
    gl.vertexAttribPointer(shader_program.position,
            this.planet_vertex_position_buffer.item_size,
            gl.FLOAT, false, 0, 0);

    // Normal
    gl.bindBuffer(gl.ARRAY_BUFFER, this.planet_vertex_normal_buffer);
    gl.vertexAttribPointer(shader_program.normal,
            this.planet_vertex_normal_buffer.item_size,
            gl.FLOAT, false, 0, 0);

    // Index
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.planet_vertex_index_buffer);

    gl.uniformMatrix4fv(shader_program.projection_matrix, false, projection_matrix);
    gl.uniformMatrix4fv(shader_program.model_matrix, false, this.model_matrix);

    var normal_matrix = mat3.create();
    mat3.normalFromMat4(normal_matrix, this.model_matrix);
    gl.uniformMatrix3fv(shader_program.normal_matrix, false, normal_matrix);
    
    gl.drawElements(gl.TRIANGLES, this.planet_vertex_index_buffer.n_items, gl.UNSIGNED_SHORT, 0);
    gl.useProgram(null);
}
