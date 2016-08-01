function exampleLoad() {
    this.RL = null; //  The Resource Loader
    this.shaderProgram = null; //  The Shader Program
}

exampleLoad.prototype.loadResources = function () {

    //  Request Resourcess
    this.RL = new ResourceLoader(this.resourcesLoaded, this);
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/default_vertex_shader.txt");
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/default_fragment_shader.txt");
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/TeapotVertices.txt");
    this.RL.addResourceRequest("TEXT", "JS/Assets/TEXT/TeapotFaces.txt");
    
    this.RL.loadRequestedResources();
};

exampleLoad.prototype.resourcesLoaded = function (exampleLoadReference) {
    // This will only run after the resouces have been loaded.
    exampleLoadReference.completeCheck();
    exampleLoadReference.begin();
};


exampleLoad.prototype.completeCheck = function () {
    //  Run a quick check
    console.log(this.RL.RLStorage.TEXT[0]);
    console.log(this.RL.RLStorage.TEXT[1]);
    console.log(this.RL.RLStorage.TEXT[2]);
    console.log(this.RL.RLStorage.TEXT[3]);
};

exampleLoad.prototype.begin = function () {
    // Begin running the program.  
    this.initShaders();
    this.initPerspectiveBuffers(this.shaderProgram);
    this.initSetupBuffers();

    //  Once everything has been finished call render from here.
    render(0.0);
};

exampleLoad.prototype.initShaders = function () {

    //  Initialize shaders - we're using that have been loaded in.
    var vertexShader = this.createShader(this.RL.RLStorage.TEXT[0], gl.VERTEX_SHADER); //  
    var fragmentShader = this.createShader(this.RL.RLStorage.TEXT[1], gl.FRAGMENT_SHADER); //  

    this.shaderProgram = gl.createProgram(); //  
    gl.attachShader(this.shaderProgram, vertexShader); //  
    gl.attachShader(this.shaderProgram, fragmentShader); //  
    gl.linkProgram(this.shaderProgram); //  

    if (!gl.getProgramParameter(this.shaderProgram, gl.LINK_STATUS)) //  
    {
        alert("Unable to initialize the shader program."); //  
    }

    gl.useProgram(this.shaderProgram); //

};

exampleLoad.prototype.createShader = function (shaderSource, shaderType) {
    //  Create a shader, given the source and the type
    var shader = gl.createShader(shaderType); //  
    gl.shaderSource(shader, shaderSource); //  
    gl.compileShader(shader); //  

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) //  
    {
        alert("An error occurred compiling the shaders: " + gl.getShaderInfoLog(shader)); //
        return null; //
    }

    return shader; //
};

exampleLoad.prototype.initPerspectiveBuffers = function (shaderProgram) {
    //  Create the matrix
    var cameraMatrix = mat4.create();

    // Load it with a perspective matrix.
    mat4.perspective(cameraMatrix, Math.PI / 3, 16.0 / 9.0, 0.1, 60.0);

    //  Create a view matrix
    var viewMatrix = mat4.create();
    //  An identity view matrix
    mat4.identity(viewMatrix);

    var mMatrix = mat4.create();
    //  Set the view matrix - we are 20 units away from all the axes.
    mat4.lookAt(viewMatrix, vec3.fromValues(20, 20, 20), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1.0, 0));

    //  Get the perspective matrix location
    var pMatrixUniform = gl.getUniformLocation(shaderProgram, "projectionMatrix");
    //  Get the view matrix location
    var vMatrixUniform = gl.getUniformLocation(shaderProgram, "viewMatrix");

    var mMatrixUniform = gl.getUniformLocation(shaderProgram, "modelMatrix");


    //  Send the perspective matrix
    gl.uniformMatrix4fv(pMatrixUniform, false, cameraMatrix);
    //  Send the view matrix
    gl.uniformMatrix4fv(vMatrixUniform, false, viewMatrix);
    //  Send the model Matrix.
    gl.uniformMatrix4fv(mMatrixUniform, false, mMatrix);

}

exampleLoad.prototype.initSetupBuffers = function () {
    
    var faceIndex = 0, vertexToFaceHash = {};
    //  Set up buffers!
    var vertices = this.RL.RLStorage.TEXT[2].split("\n");
    for(var i = 0; i < vertices.length; i++)
    {
        vertices[i]= vertices[i].split(" ");
        for(var j = 0; j < 3; j++)
            vertices[i][j] = parseFloat(vertices[i][j]);
    }
   
    var faces = this.RL.RLStorage.TEXT[3].split("\n");
    //console.log("facenum = " + faces.length);
    for (var i =0; i < faces.length ; i++)
    {
        faces[i] = faces[i].split(" ");
        for(var j = 0; j < 3; j++)
            faces[i][j] = parseInt(faces[i][j],10)-1;
        for (var j = 0; j < faces[i].length; j++) {
                var vertIndex = faces[i][j];    // Indexed at 0.
                vertexToFaceHash[vertIndex] = vertexToFaceHash[vertIndex] || [];
                vertexToFaceHash[vertIndex].push(faceIndex);
            }
            faceIndex++;
    }
    
    console.log("the # of vertices is:" + vertices.length);
    console.log("the # of faces is: " + faces.length);

    var normals = getVertexNormals(vertices, faces, vertexToFaceHash);

    //console.log(normals);
    //console.log("there are " + normals.length + " normals");
    /*
    var colors = [0.0 / 255.0, 62 / 255.0, 80 / 255, 1.0,
                 0.0 / 255.0, 62 / 255.0, 80 / 255, 1.0,
                 0.0 / 255.0, 62 / 255.0, 80 / 255, 1.0,
                 0.0 / 255.0, 62 / 255.0, 80 / 255, 1.0];

    basicColors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, basicColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    */
    /*
    vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "vertexColor"); //  
    gl.bindBuffer(gl.ARRAY_BUFFER, basicColors); //  
    gl.enableVertexAttribArray(vertexColorAttribute); //  
    gl.vertexAttribPointer(vertexColorAttribute, 4, gl.FLOAT, false, 0, 0); //  
    */

    //console.log("num of color " + basicColors.numItems);

    //vertices buffer
    teapotVerticesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVerticesBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    teapotVerticesBuffer.itemSize = 3;
    teapotVerticesBuffer.numItems = vertices.length;

    //normals buffer
    teapotVertexNormalsBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalsBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW);
    teapotVertexNormalsBuffer.itemSize = 3;
    teapotVertexNormalsBuffer.numItems = normals.length;

    //faces buffer
    teapotFacesTriBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotFacesTriBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(faces), gl.STATIC_DRAW);
    teapotFacesTriBuffer.itemSize = 1;
    teapotFacesTriBuffer.numItems = faces.length;

    vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vertexPosition"); //
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVerticesBuffer); //
    gl.enableVertexAttribArray(vertexPositionAttribute); //
    gl.vertexAttribPointer(vertexPositionAttribute, teapotVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0); //

   vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, "vertexNormal"); //
   gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalsBuffer); //
   gl.enableVertexAttribArray(vertexNormalAttribute); //
   gl.vertexAttribPointer(vertexNormalAttribute, teapotVertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0); 

    var colors = [];
    for(var i = 0; i < faces.length; i++)
    {
        colors.push(0.0 / 255.0, 62.0 / 255.0, 80.0 / 255.0, 1.0);
    }

    basicColors = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, basicColors);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    basicColors.itemSize = 4;
    basicColors.numItems = colors.length / 4; 

    vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "vertexColor"); //
    gl.bindBuffer(gl.ARRAY_BUFFER, basicColors); //
    gl.enableVertexAttribArray(vertexColorAttribute); //
    gl.vertexAttribPointer(vertexColorAttribute, basicColors.itemSize, gl.FLOAT, false, 0, 0); //

/*
    // Bind Vertices Buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVerticesBuffer);
    gl.vertexAttribPointer(vertexPositionAttribute, teapotVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0);
    
    // Bind normal buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalsBuffer);
    gl.vertexAttribPointer(vertexNormalAttribute, teapotVertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0);  
*/
}

/**
 * Computes the face normal given the face's vertex indices relative to a set of
 * vertices.
 * 
 * @param  {Array.Number} vertexIndices The face's vertex indices indexed at 0.
 * @param  {Array.Array} vertices       The set of vertices passed in.
 * 
 * @return {vec3}                       The normal vector to the face.
 */
function getFaceNormal (vertexIndices, vertices){
    var v1 = vertices[vertexIndices[0]];
    var v2 = vertices[vertexIndices[1]];
    var v3 = vertices[vertexIndices[2]];

    var edge1 = vec3.create();
    var edge2 = vec3.create();
    edge1 = vec3.subtract(edge1, v2, v1);
    edge2 = vec3.subtract(edge2, v3, v1);
    
    //console.log(edge1,edge2);
    
    //console.log(vec3.cross(edge1, edge2, vec3.create()));
    return vec3.cross(vec3.create, edge1, edge2);
}


exampleLoad.prototype.loadTeapotBuffers = function () {
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVerticesBuffer);
  teapotVerticesBuffer.itemSize = 3;
  teapotVerticesBuffer.numItems = vertices.length / 3;

  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalsBuffer);
  teapotVertexNormalsBuffer.itemSize = 3;
  teapotVertexNormalsBuffer.numItems = normals.length / 3;

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, teapotFacesTriBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.fTeapot), gl.STATIC_DRAW);
  teapotFacesTriBuffer.itemSize = 1;
  teapotFacesTriBuffer.numItems = faces.length;

  vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vertexPosition"); //
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVerticesBuffer); //
  gl.enableVertexAttribArray(vertexPositionAttribute); //
  gl.vertexAttribPointer(vertexPositionAttribute, teapotVerticesBuffer.itemSize, gl.FLOAT, false, 0, 0); //

  vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, "vertexNormal"); //
  gl.bindBuffer(gl.ARRAY_BUFFER, teapotVertexNormalsBuffer); //
  gl.enableVertexAttribArray(vertexNormalAttribute); //
  gl.vertexAttribPointer(vertexNormalAttribute, teapotVertexNormalsBuffer.itemSize, gl.FLOAT, false, 0, 0); //

  gl.bindBuffer(gl.ARRAY_BUFFER, basicColors);
  basicColors.itemSize = 4;
  basicColors.numItems = this.vTeapot.length / 3;

  vertexColorAttribute = gl.getAttribLocation(this.shaderProgram, "vertexColor"); //
  gl.bindBuffer(gl.ARRAY_BUFFER, basicColors); //
  gl.enableVertexAttribArray(vertexColorAttribute); //
  gl.vertexAttribPointer(vertexColorAttribute, basicColors.itemSize, gl.FLOAT, false, 0, 0); //

  return this.fTeapot.length;
};

/**
 * Computes a list of normal vectors for each vertex relative to a set of faces
 * and provided a vertex-to-face hash.
 * 
 * @param  {Array.Array} vertices           The set of vertices.
 * @param  {Array.Array} faces              The set of faces.
 * @param  {Object} vertexToFaceHash        A map from vertex indices to a face.
 * 
 * @return {Array.vec3}                     The list of vertex normals.
 */
function getVertexNormals (vertices, faces, vertexToFaceHash){
    var normals = [];
    var faceNormals = [];
    for (var i = 0; i < faces.length; i++){
        faceNormals[i] = getFaceNormal(faces[i], vertices);
    }   
    
    // Calculate per-vertex normals.
    for (i = 0; i < vertices.length; i++){
        var neighborFaces = vertexToFaceHash[i];    // Indexed at 0.

        // Once all neighbor normals are computed, sum the normals of
        // neighboring faces to get the vertex's normal.
        var vertNormal = vec3.create();
        for (var j = 0; j < neighborFaces.length; j++)
        {
            var neighborFaceIndex = neighborFaces[j];       // Indexed at 0.
            vec3.add(vertNormal, vertNormal, faceNormals[neighborFaceIndex]);
        }

        // Normalize the vertex normal.
        vec3.normalize(vertNormal, vertNormal);

        // Save the current vertex's normal vector.
        normals[i] = vertNormal;
    }
    return normals;
}

exampleLoad.prototype.draw = function () {
    //  Draw function - called from render in index.js
    // Enable Depth Testing
    var numT;
    gl.clearColor(1, 1, 0.1, 1.0); //  Set the clear color
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //  Clear the color as well as the depth buffer

    gl.enable(gl.DEPTH_TEST);

    gl.useProgram(this.shaderProgram);

    //vertexPositionAttribute = gl.getAttribLocation(this.shaderProgram, "vertexPosition");
    //gl.enableVertexAttribArray(vertexPositionAttribute);

// vertexNormalAttribute = gl.getAttribLocation(this.shaderProgram, "vertexNormal");
  //  gl.enableVertexAttribArray(vertexNormalAttribute);

    numF = this.loadTeapotBuffers();

    gl.drawElements(gl.TRIANGLES, numF, gl.UNSIGNED_SHORT, 0);
    gl.useProgram(this.terrainShaderProgram);


}