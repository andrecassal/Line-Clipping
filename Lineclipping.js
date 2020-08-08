
const INSIDE = 0; // 0000
const LEFT = 1;   // 0001
const RIGHT = 2;  // 0010
const BOTTOM = 4; // 0100
const TOP = 8;    // 1000

class PatternSquare{		
	constructor(bx,by,bw,bh){
		this.bx = bx;
		this.by = by;
		this.bw = bw;
		this.bw2 = this.bw/2;
		this.bh = bh;
		this.bh2 = this.bh/2;
		this.density = random(2,10);
		this.minDensity = 2;
		this.angle = random(TWO_PI);
		this.renderFill = false;
		this.stroke = color(0);
		this.strokeWeight = 1;
	}
	//Find position of the x,y coord and encode
	boundaries(x,y){
		let code=0;
		
		if(x < this.bx){									code |= LEFT;		}
		else if(x > (this.bx+this.bw)){		code |= RIGHT; 	}

		if(y < this.by){									code |= BOTTOM;	}
		else if(y > (this.by+this.bh)){		code |= TOP;		}

		// console.log("encode",x,y,"code:"+code)
		// console.log("------")

		return code;
	}
	line(x0,y0,x1,y1){
	
		let xmin, xmax, ymin, ymax;

		xmin = this.bx;
		ymin = this.by;
		xmax = this.bx + this.bw;
		ymax = this.by + this.bh;

		let e0code, e1code;
		let accept = false;
		let i=0;

		do{
			e0code = this.boundaries(x0,y0);
			e1code = this.boundaries(x1,y1);
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
			push();
			// console.log("Accept: ",x0,y0,x1,y1);
			stroke(this.stroke);
			strokeWeight(this.strokeWeight);
			line(x0,y0,x1,y1);
			pop();
		}

		return accept;
	}
	render(){
		
		let xstart = this.bx + random(this.bw);
		let ystart = this.by + random(this.bh);

		let slope = tan(this.angle);
		let c = ystart - slope * xstart;

		let downAccept = true;
		let upAccept = true;
		let step = this.density < this.minDensity ? this.minDensity : this.density;
		let cosa = cos(this.angle);
		let i = 0;
		
		if(this.renderFill){
			rect(this.bx,this.by,this.bw,this.bh)
		}

		while (downAccept || upAccept) {
			// console.log('draw while '+i)
			let x0 = this.bx - this.bw2;
			let y0 = slope * x0 + c + i * step / cosa;
			let x1 = this.bx + this.bw + this.bw2;
			let y1 = slope * x1 + c + i * step / cosa;
			upAccept = this.line(x0, y0, x1, y1);

			x0 = this.bx - this.bw2;
			y0 = slope * x0 + c - i * step / cosa;
			x1 = this.bx + this.bw + this.bw2;
			y1 = slope * x1 + c - i * step / cosa;
			downAccept = this.line(x0, y0, x1, y1);

			i++;
		}
	}

}

