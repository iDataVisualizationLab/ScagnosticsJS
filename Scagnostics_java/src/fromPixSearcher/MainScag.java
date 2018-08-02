package fromPixSearcher;
import java.awt.Color;

import java.util.ArrayList;
import java.util.Iterator;

import processing.core.PApplet;
import processing.core.PFont;

public class MainScag extends PApplet {
	public static int count = 0;
	public static int numScagnostics =5;
	public static double[] scagnostics = new double[numScagnostics];
	public static double[] data1 = {0,0.91,0.82,0.81,0.71,0.65,0.7,0.2,0.51,0.7,
		0.74,0.21,0.86,0.65,0.33,0.61,0.54,0.4,0.1,0.6,0.3,0.6,0.9,0.6,0.5,0.4,0.7,0.92};
	public static double[] data2 = {1,0.01,0.32,0.13,0.22,0.87,0.5,0.9,0.72,0.5,
		0.72,0.72,0.57,0.41,0.87,0.12,0.39,0.9,0.8,0.9,1.0,0.6,0.2,0.2,0.0,0.1,0.3,0.41};
	@SuppressWarnings("rawtypes")
	public static ArrayList MST = new ArrayList();
	public static double areaAlpha = 0;
	public static double periAlpha = 0;
	public static Triangulation DT;
	public PFont metaBold = loadFont("Arial-BoldMT-18.vlw");
	
	
	public static void main(String args[]){
	  PApplet.main(new String[] { MainScag.class.getName() });
    }
	
	public void setup() {
		size(1280, 750);
		stroke(255);
		frameRate(12);
		curveTightness(1.f); 
		smooth();
		computeScagnosticsOnFileData();
	}
	
	private static void computeScagnosticsOnFileData() {
        Triangulation dt = new Triangulation();
       boolean[][] dataxxx = new boolean[Scagnostics.size+1][Scagnostics.size+1];
       for (int m = 0; m < data1.length; m++) {
    	      int x = (int) (data1[m]*Scagnostics.size);
    		  int y = (int) (data2[m]*Scagnostics.size);   
    		  dataxxx[x][y] = true;
    	    	   
       }
           
       
        double[] mt = dt.compute(dataxxx);
        if (mt == null)
            return;
        
        for (int m = 0; m < numScagnostics; m++) {
            if (Double.isNaN(mt[m]))
                mt[m] = 0;
            scagnostics[m] = mt[m];
           // System.out.println(scagnostics[m]);
        }
        
        MST = dt.mstEdges;
        areaAlpha = dt.alphaArea;
        periAlpha = dt.alphaPerimeter;
        DT = dt;
     }
	
	public void draw() {
		this.background(255,255,255);
		
		boolean showMST =true;
		boolean alphaShape =true;
		boolean convexHull =true;
		
		this.noStroke();
		float xoff = 100;
		float yoff = 100;
		float scale = 275;
		float margin = 30;
		
		
		//MST
		if (showMST){
			this.stroke(0,200,0);
			for (int i = 0; i < MST.size(); i++) {
				Edge e = (Edge) MST.get(i);
				float x1 = xoff + e.p1.x*scale/Scagnostics.size;
				float x2 = xoff + e.p2.x*scale/Scagnostics.size;
				float y1 = yoff + e.p1.y*scale/Scagnostics.size;
				float y2 = yoff + e.p2.y*scale/Scagnostics.size;
				this.line(x1, y1, x2, y2);
			}
		}
		noStroke();
		this.fill(Color.BLACK.getRGB());
		for (int i = 0; i < data1.length; i++) {
			float xx = (float) (xoff + data1[i]*scale);
			float yy = (float) (yoff + data2[i]*scale);
			this.ellipse(xx, yy, 10, 10);
		}
		noFill();
		stroke(0,0,0);
		rect(xoff-margin,yoff-margin, scale+margin*2, scale+margin*2);
		
		this.textAlign(PApplet.CENTER);
		//fill(0,200,0);
		fill(0,200,0);
		this.textFont(metaBold, 40);
		text("MST",xoff+scale/2, yoff-45);
		
		
		xoff = 500;
		if (alphaShape){
		  // DRAW triangle forming ALPHA SHAPE
			this.noStroke();
			this.fill(255,200,0);
			Iterator tri = DT.triangles.iterator();
		    this.curveTightness(1); 
			while (tri.hasNext()) {
				Triangle triangle = (Triangle) tri.next();
				if (triangle.onComplex) {
			         Edge e1 = triangle.anEdge;
	                Edge e2 = triangle.anEdge.nextE;
	                Edge e3 = triangle.anEdge.nextE.nextE;
	                float x1 = xoff + (e1.p1.x)*scale/39;
	                float x2 = xoff + (e2.p1.x)*scale/39;
	                float x3 = xoff + (e3.p1.x)*scale/39;
	                float y1 = yoff + (e1.p1.y)*scale/39;
	                float y2 = yoff + (e2.p1.y)*scale/39;
	                float y3 = yoff + (e3.p1.y)*scale/39;
	                
	                this.beginShape();
	                this.curveVertex(x1, y1);
	                this.curveVertex(x1, y1);
	                this.curveVertex(x2, y2);
	                this.curveVertex(x3, y3);
	                this.curveVertex(x1, y1); 
	                this.curveVertex(x1, y1); 
	                this.endShape();
				 }
	        }
		}
		noFill();
		stroke(0,0,0);
		rect(xoff-margin,yoff-margin, scale+margin*2, scale+margin*2);
		fill(240,160,0);
		text("Alpha Shape",xoff+scale/2, yoff-45);
		
			
	      //DRAW ALPHA SHAPE
			this.stroke(240,160,0);
			Iterator it = DT.edges.iterator();
		    
			while (it.hasNext()) {
	            Edge e = (Edge) it.next();
	            if (e.onShape) {
	            	float x1 = xoff + (e.p1.x)*scale/39;
	    			float x2 = xoff + (e.p2.x)*scale/39;
	    			float y1 = yoff + (e.p1.y)*scale/39;
	    			float y2 = yoff + (e.p2.y)*scale/39;
	    			this.line(x1, y1, x2, y2);
	            }
		      }
		      
		    //p.fill(Color.CYAN.getRGB());
		    //p.text((int)areaAlpha[fileID]+"/"+(int)periAlpha[fileID],xoff,yoff+16);
			noStroke();
			this.fill(Color.BLACK.getRGB());
			for (int i = 0; i < data1.length; i++) {
				float xx = (float) (xoff + data1[i]*scale);
				float yy = (float) (yoff + data2[i]*scale);
				this.ellipse(xx, yy, 10, 10);
			
			}
				
	   
		
		 // DRAW HULL
		xoff = 900;
		if (convexHull){
			this.stroke(Color.BLUE.getRGB());
			this.strokeWeight(2);
			Edge e = DT.hullStart;
			if (e !=null){
		        do {
		        	float x1 = xoff + (e.p1.x)*scale/39;
	    			float x2 = xoff + (e.p2.x)*scale/39;
	    			float y1 = yoff + (e.p1.y)*scale/39;
	    			float y2 = yoff + (e.p2.y)*scale/39;
	    			this.line(x1, y1, x2, y2);
		            e = e.nextH;
		        } while (!e.isEqual(DT.hullStart));
			}
		} 
		noStroke();
		this.fill(Color.BLACK.getRGB());
		for (int i = 0; i < data1.length; i++) {
			float xx = (float) (xoff + data1[i]*scale);
			float yy = (float) (yoff + data2[i]*scale);
			this.ellipse(xx, yy, 10, 10);
		}
		noFill();
		stroke(0,0,0);
		rect(xoff-margin,yoff-margin, scale+margin*2, scale+margin*2);
		
		rect(xoff-margin,yoff-margin, scale+margin*2, scale+margin*2);
		//fill(0,0,255);
		fill(0,0,255);
		text("Convex Hull",xoff+scale/2, yoff-45);
		
		
		
	}	

}	
