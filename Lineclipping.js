
const INSIDE = 0; // 0000
const LEFT = 1;   // 0001
const RIGHT = 2;  // 0010
const BOTTOM = 4; // 0100
const TOP = 8;    // 1000

function encodeClip(x,y,bx,by,bw,bh){
	let code=0;
	let xmin,ymin,xmax,ymax;

	xmin = bx;
	ymin = by;
	xmax = bx + bw;
	ymax = by + bh;
	
	if(x < xmin){
		code |= LEFT;
	}else if(x > xmax){
		code |= RIGHT;
	}

	if(y < ymin){
		code |= BOTTOM;
	}else if(y > ymax){
		code |= TOP;
	}

	// console.log("encode",x,y,"code:"+code)
		// console.log("------")
	
	return code;
}




function xline(x0,y0,x1,y1,bx,by,bw,bh){
	
	let xmin, xmax, ymin, ymax;
	
	xmin = bx;
	ymin = by;
	xmax = bx + bw;
	ymax = by + bh;
	
	let e0code, e1code;
	let accept = false;
	let i=0;
	
	do{
		e0code = encodeClip(x0,y0,bx,by,bw,bh);
		e1code = encodeClip(x1,y1,bx,by,bw,bh);
		i++;
		// console.log('while ' + i)
		// console.log(e0code +" / "+e1code)
		//completely inside
		if(e0code == 0 && e1code == 0){
			accept = true;
			break;
		}
		//completely outside
		else if((e0code & e1code) != 0){
			break;
		}
		else{
			let newx, newy;
			let code = e0code != 0 ? e0code : e1code;
			// console.log("else "+code)
			/*
			 * Now figure out the new endpoint that needs to replace 
			 * the current one. Each of the four cases are handled
			 * separately.
			 */
			if ((code & TOP)) {
				// console.log('above')
				/* Endpoint is above the clip window */
				newy = ymax;
				newx = (x1 - x0) * (ymax - y0) / (y1 - y0) + x0;
			} else if ((code & BOTTOM)) {
				// console.log('below')
				/* Endpoint is below the clip window */
				newy = ymin;
				newx = (x1 - x0) * (ymin - y0) / (y1 - y0) + x0;
			} else if ((code & RIGHT)) {
				// console.log('right')
				/* Endpoint is to the right of clip window */
				newx = xmax;
				newy = (y1 - y0) * (xmax - x0) / (x1 - x0) + y0;
			} else if ((code & LEFT)) {
				// console.log('left')
				/* Endpoint is to the left of clip window */
				newx = xmin;
				newy = (y1 - y0) * (xmin - x0) / (x1 - x0) + y0;
			}
			// console.log("else2 "+code,x0,y0,x1,y1,newx,newy)
			/* Now we replace the old endpoint depending on which we chose */
			if (code == e0code) {
				x0 = newx;
				y0 = newy;
			} else {
				x1 = newx;
				y1 = newy;
			}
			// console.log("end else",x0,y0,x1,y1)
		}			
	}while(true && i<10);
	
	if(accept){
		// console.log("Accept: ",x0,y0,x1,y1);
		// stroke(0);
		// strokeWeight(10);
		// rect(x0,y0,10,10)
		line(x0,y0,x1,y1);
	}
	
	return accept;
}



function draw_square(x,y,w,h,step,a){
  let xstart = x + random(w);
  let ystart = y + random(h);

  let slope = tan(a);
  let c = ystart - slope * xstart;

  let downAccept = true;
  let upAccept = true;
  
  let i = 0;
  
  //for (int i = 0; i < w / step; i++) {
  while (downAccept || upAccept) {
    let x0 = x - w/2;
    let y0 = slope * x0 + c + i * step / cos(a);
    let x1 = x + w + w/2;
    let y1 = slope * x1 + c + i * step / cos(a);
    upAccept = xline(x0, y0, x1, y1, x, y, w, h);
    
    x0 = x - w/2;
    y0 = slope * x0 + c - i * step / cos(a);
    x1 = x + w + w/2;
    y1 = slope * x1 + c - i * step / cos(a);
    downAccept = xline(x0, y0, x1, y1, x, y, w, h);
    
    i++;
  }
}
