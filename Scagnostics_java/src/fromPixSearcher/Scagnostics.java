package fromPixSearcher;


import java.awt.Color;
import java.util.ArrayList;
import java.util.Iterator;

import processing.core.PApplet;


public class Scagnostics{
	public static double[] scagnostics = null;
	public static Triangulation dt;
	public static int size =100;
	//@SuppressWarnings("rawtypes")
	//public static ArrayList[] MST;
	//public static Triangulation[] DT;
	//public static double[] areaAlpha = null;
	//public static double[] periAlpha = null;
	
	@SuppressWarnings("rawtypes")
	public static void init1() {
	/*	 MST = new ArrayList[nI];
		 for (int i=0; i<nI;i++){
			 MST[i] =  new ArrayList();
		 }
		 DT = new Triangulation[nI];
		 areaAlpha = new double[nI];
		 periAlpha = new double[nI]; */
	}
		
	public static void computeScagnosticsOnFileData(boolean[][] data) {
		scagnostics = new double[9];
		dt = new Triangulation();
		double[] mt = dt.compute(data);
		if (mt == null)
			return;
		for (int m = 0; m < mt.length; m++) {
			if (Double.isNaN(mt[m]))
				mt[m] = 0;
			scagnostics[m] = mt[m];
		}
		
	/*	MST[fileID] =  dt.mstEdges;
		DT[fileID] =dt;
		
		areaAlpha[fileID] = dt.alphaArea;
		periAlpha[fileID] = dt.alphaPerimeter;*/
		
		//System.out.println("MST[fileID].size():"+MST[fileID].size());
	}
	
	/*
	// Symmetric:  Point concentration HORIZONTAL
	public static float computeSymmatic() {
 	 	float sym = 0;
 	 	for (int i=0;i<size;i++){ 
			 for (int j=0;j<size;j++){
	 			 if (data[i][j]){
	 				 float symHorizontal = i-(size/2-0.5f);
	 			 	 sym += symHorizontal;
	 			 }
			 }
	 	 }	 
	 	 return sym/(size*size);  
		 
	}
	*/
	
	 //****************************************************************************************					
		/*
		// CLUMPY:  Number of connected components
		for (int step1=0; step1<numStep;step1++){ 
			 message = "Computing Scagnostics for Black image: "+step1;
			 for (int f=0; f<files.size();f++){ 
				 	getDataBlack(files.get(f), f,step1); 
				 	int[][] data2 = new int[size][size];
					for (int i1 = 0; i1 < size; i1++) {
						for (int i2 = 0; i2 < size; i2++) {
							if (data[i1][i2]){
								data2[i1][i2] =2;
							}	
						}
					}
					
					int count =0;
				 	 for (int i=0;i<size;i++){ 
						 for (int j=0;j<size;j++){
							 if (infect(i,j,data2)){
								 count++;
							 }
						 }
				 	 }	 
				 	 System.out.println(count);
				 	scagVals[step1][f] = (float) count/size;  
			 } 
			 percent = 0.6f+0.3f*((float) step/9);
			 step3 =step;	 
		}	*/ 
	
	//****************************************************************************************		
	
	public static void drawMST(PApplet p , int fileID, float xoff,
			float yoff, int ht, int wt) {
		
		
		/*
		p.noStroke();
		p.fill(Color.YELLOW.getRGB());
		for (int i = 0; i < bDATA[fileID].getCounts().length; i++) {
			if (bDATA[fileID].getCounts()[i]==1){
				float xx = xoff + bDATA[fileID].x[i]*2*scale-scale*size;
				float yy = yoff + bDATA[fileID].y[i]*2*scale-scale*size;
				p.ellipse(xx, yy, 2, 2);
			}
		}*/
		
		
		//MST
		/*
		if (showMST){
			p.stroke(Color.MAGENTA.getRGB());
			for (int i = 0; i < MST[fileID].size(); i++) {
				Edge e = (Edge) MST[fileID].get(i);
				float x1 = xoff + e.p1.x*2*scale-scale*size;
				float x2 = xoff + e.p2.x*2*scale-scale*size;
				float y1 = yoff + e.p1.y*2*scale-scale*size;
				float y2 = yoff + e.p2.y*2*scale-scale*size;
				p.line(x1, y1, x2, y2);
			}
		}
		*/
		
		/*
		if (alphaShape){
		 
	   
	     // DRAW triangle forming ALPHA SHAPE
			p.noStroke();
			p.fill(new Color(0,200,200).getRGB());
			Iterator tri = DT[fileID].triangles.iterator();
		    p.curveTightness(1); 
			while (tri.hasNext()) {
	            Triangle triangle = (Triangle) tri.next();
	            if (triangle.onComplex) {
	                Edge e1 = triangle.anEdge;
	                Edge e2 = triangle.anEdge.nextE;
	                Edge e3 = triangle.anEdge.nextE.nextE;
	                
	                float x1 = xoff + (e1.p1.x*2-size+1)*scale;
	                float x2 = xoff + (e2.p1.x*2-size+1)*scale;
	                float x3 = xoff + (e3.p1.x*2-size+1)*scale;
	                float y1 = yoff + (e1.p1.y*2-size+1)*scale;
	                float y2 = yoff + (e2.p1.y*2-size+1)*scale;
	                float y3 = yoff + (e3.p1.y*2-size+1)*scale;
	                
	                p.beginShape();
	                p.curveVertex(x1, y1);
	                p.curveVertex(x1, y1);
	                p.curveVertex(x2, y2);
	                p.curveVertex(x3, y3);
	                p.curveVertex(x1, y1); 
	                p.curveVertex(x1, y1); 
	                p.endShape();
	           }
	        }
		
			*/
	      //DRAW ALPHA SHAPE
			/*
			p.stroke(Color.BLUE.getRGB());
			Iterator i = DT[fileID].edges.iterator();
		    
			while (i.hasNext()) {
	            Edge e = (Edge) i.next();
	            if (e.onShape) {
	            	
	            	float x1 = xoff + (e.p1.x*2-size+1)*scale;
	    			float x2 = xoff + (e.p2.x*2-size+1)*scale;
	    			float y1 = yoff + (e.p1.y*2-size+1)*scale;
	    			float y2 = yoff + (e.p2.y*2-size+1)*scale;
	    			p.line(x1, y1, x2, y2);
	            }
		      }
		      */
		    //p.fill(Color.CYAN.getRGB());
		    //p.text((int)areaAlpha[fileID]+"/"+(int)periAlpha[fileID],xoff,yoff+16);
			
	  // }
		
		 // DRAW HULL
		/*if (convexHull){
			p.stroke(Color.RED.getRGB());
			Edge e = DT[fileID].hullStart;
			if (e !=null){
		        do {
		        	float x1 = xoff + (e.p1.x*2-size+1)*scale;
	    			float x2 = xoff + (e.p2.x*2-size+1)*scale;
	    			float y1 = yoff + (e.p1.y*2-size+1)*scale;
	    			float y2 = yoff + (e.p2.y*2-size+1)*scale;
	    			p.line(x1, y1, x2, y2);
		            e = e.nextH;
		        } while (!e.isEqual(DT[fileID].hullStart));
			}
		} */
	}
	
	
	
}
