/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package javaapplication1;

/**
 *
 * @author idvlab
 */
public class JavaApplication1 {

    /**
     * @param args the command line arguments
     */
    public static void main(String[] args) {
        System.out.print(format(1.115, 2, 0));
    }
    static final String ZEROES = "000000000000";
    static final String BLANKS = "            ";

    static String format(double val, int n, int w) {
        if (Double.isNaN(val)) {
            return "\"NaN\"";
        } else if (val < 0.005) {
            return "0";
        }

        //	rounding			
        double incr = 0.5;
        for (int j = n; j > 0; j--) {
            incr /= 10;
        }
        val += incr;

        String s = Double.toString(val);
        int n1 = s.indexOf('.');
        int n2 = s.length() - n1 - 1;

        if (n > n2) {
            s = s + ZEROES.substring(0, n - n2);
        } else if (n2 > n) {
            s = s.substring(0, n1 + n + 1);
        }

        if (w > 0 & w > s.length()) {
            s = BLANKS.substring(0, w - s.length()) + s;
        } else if (w < 0 & (-w) > s.length()) {
            w = -w;
            s = s + BLANKS.substring(0, w - s.length());
        }
        return s;
    }

}
