function Planet(radius)
{
    this.radius = radius;
    this.modelview_matrix = mat4.create();
    this.square_vertex_position_buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, this.square_vertex_position_buffer);
    var vertices = [
        1.0, 1.0, 0.0,
        -1.0, 1.0, 0.0,
        1.0, -1.0, 0.0,
        -1.0, -1.0, 0.0];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.square_vertex_position_buffer.item_size = 3;
    this.square_vertex_position_buffer.num_items = 4;
}


Planet.prototype.update = function()
{
    mat4.identity(this.modelview_matrix);
    mat4.translate(this.modelview_matrix, this.modelview_matrix, [0.0, 0.0, -7.0]);
} 


Planet.prototype.render = function(shader_program, projection_matrix)
{
    gl.useProgram(shader_program);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.square_vertex_position_buffer);
    gl.vertexAttribPointer(shader_program.vertexPositionAttribute,
            this.square_vertex_position_buffer.item_size,
            gl.FLOAT, false, 0, 0);

    gl.uniformMatrix4fv(shader_program.pMatrixUniform, false, projection_matrix);
    gl.uniformMatrix4fv(shader_program.mvMatrixUniform, false, this.modelview_matrix);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, this.square_vertex_position_buffer.num_items);
    gl.useProgram(null);
}
