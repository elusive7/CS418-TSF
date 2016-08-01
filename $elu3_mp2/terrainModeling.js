//-------------------------------------------------------------------------
/*
  This function iteratively generates the terrain and is provided to us. 
  I wanted to modify it with the diamond square algorithm in order to
  fully complete the assignment, but I was unable to do so; if line 16 is
  commented back in, you can test it and see that a few triangles are 
  indeed generated; however, not all of them are generated, and therefore,
  I decided it would be better to leave it as the 2D terrain one that was
  provided to us. 

  Below, you can find my attempted code for the diamond-square algorithm.
  I did give it a shot, but wasn't able to fully complete it, sadly :(
*/
function terrainFromIteration(n, minX,maxX,minY,maxY, vertexArray, faceArray,normalArray, gridmap)
{
    var deltaX=(maxX-minX)/n;
    var deltaY=(maxY-minY)/n;
    for(var i=0;i<=n;i++)
       for(var j=0;j<=n;j++)
       {  
           vertexArray.push(minX+deltaX*j);
           vertexArray.push(minY+deltaY*i);
           if (1)//((i == n) || (j == n))
           {
              vertexArray.push(0);
           }
           else
           {
              vertexArray.push(gridmap[j][i]);
           }
           
           normalArray.push(0);
           normalArray.push(0);
           normalArray.push(1);
       }

    var numT=0;
    for(var i=0;i<n;i++)
       for(var j=0;j<n;j++)
       {       
           var vid = i*(n+1) + j;
           faceArray.push(vid);
           faceArray.push(vid+1);
           faceArray.push(vid+n+1);
           
           faceArray.push(vid+1);
           faceArray.push(vid+1+n+1);
           faceArray.push(vid+n+1);
           numT+=2;           
       }

    return numT;
}

/*
  This function uses helper functions square and diamond to implement our desired algorithm
  It takes in a gridmap, a size, and a scale, and recurses to generate our terrain, until 
  no more new triangles can be generated. 
*/
function divide(map, size, scale) {
          var x, y, half = size / 2;
          if (half < 1) return;

          for (y = half; y < size; y += size) {
            for (x = half; x < size; x += size) {
              square(x, y, half, Math.random() * scale * 2 - scale, map);
            }
          }
          for (y = 0; y <= size; y += half) {
            for (x = (y + half) % size; x <= size; x += size) {
              diamond(x, y, half, Math.random() * scale * 2 - scale, map);
            }
          }
          divide(map, size/2, scale/2);
        }

/*
  A helper function that we use to calculate the average of our values. 
*/
function average(values) {
          var valid = values.filter(function(val) { return val !== -1; });
          var total = valid.reduce(function(sum, val) { return sum + val; }, 0);
          return total / valid.length;
        }

/*
  The diamond part of our calculator in generating the terrain. Couldn't
  finish debugging the entire diamond-square algorithm to completion.
*/
function diamond(x, y, size, offset, map) 
{
  var ave = average([
    get(map, x, y - size),      // top
    get(map, x + size, y),      // right
    get(map, x, y + size),      // bottom
    get(map, x - size, y)       // left
  ]);
    map[x][y] = (ave + offset);
}

/*
  The square part of our calculator in generating the terrain. Couldn't 
  finish debugging the entire diamond-square algorithm to completion.
*/
function square(x, y, size, offset, map) {
  var ave = average([
    get(map, x - size, y - size),   // upper left
    get(map, x + size, y - size),   // upper right
    get(map, x + size, y + size),   // lower right
    get(map, x - size, y + size)    // lower left
  ]);
    map[x][y] = (ave + offset);
  }

/*
  Helper funtion to get the current value of our cell
*/
function get(map, x, y) {
  if (x < 0 || y < 0 || x > map.length-1 || y < 0 || y > map.length-1)
    return -1;
  else
    return map[x][y];
}
//-------------------------------------------------------------------------
function generateLinesFromIndexedTriangles(faceArray,lineArray)
{
    numTris=faceArray.length/3;
    for(var f=0;f<numTris;f++)
    {
        var fid=f*3;
        lineArray.push(faceArray[fid]);
        lineArray.push(faceArray[fid+1]);
        
        lineArray.push(faceArray[fid+1]);
        lineArray.push(faceArray[fid+2]);
        
        lineArray.push(faceArray[fid+2]);
        lineArray.push(faceArray[fid]);
    }
}

//-------------------------------------------------------------------------

document.onkeydown = function (e){
  if (e.keyCode === 37) {
    //move left
    HelloTerrain.left = true;
    HelloTerrain.right = false;
    console.log("it moved left")
  } else if (e.keyCode === 38) {
    //move up
    HelloTerrain.up = true;
    HelloTerrain.down = false;
    console.log("it moved up");
  } else if (e.keyCode === 39) {
    //move right
    HelloTerrain.left = false;
    HelloTerrain.right = true;
    console.log("it moved right");
  } else if (e.keyCode === 40) {
    //move down
    HelloTerrain.up = false;
    HelloTerrain.down = true;
    console.log("it moved down");
  }
}

/**
 * Trigger flight controls for navigation when arrow keys are pressed.
 *
 * @param {Event} e The keyseyup event.
 */
document.onkeyup = function (e){
  if (e.keyCode === 37) {
    //move left
    HelloTerrain.left = false;
  } else if (e.keyCode === 38) {
    //move up
    HelloTerrain.up = false;
  } else if (e.keyCode === 39) {
    //move right
    HelloTerrain.right = false;
  } else if (e.keyCode === 40) {
    //move down
    HelloTerrain.down = false;
  }

  if (e.keyCode >= 37 && e.keyCode <= 40) {
    rot = quat.create([0.0, 0.0, 0.0, 1.0]);
  }
}

