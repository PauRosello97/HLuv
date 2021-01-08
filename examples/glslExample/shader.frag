// Author:
// Title:

#ifdef GL_ES
precision mediump float;
#endif

//Generació color
float PI = 3.1415926535897932384626433832795;
float TWO_PI = PI*2.;
float k = 0.0011070564598794539; //(3/29)^3
float maxS = 93.727325;	
float kL = 7.67;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;

float u_n1 = 1.;
float u_n2 = 1.;
float u_n3 = 1.;
float u_n4 = 1.;
float u_n5 = 1.;
float u_n6 = 1.;
float u_n7 = 1.;

float u_h1 = 0.;
float u_h2 = 60.;
float u_h3 = 120.;
float u_h4 = 330.;
float u_h5 = 30.;
float u_h6 = 90.;
float u_h7 = 150.;
    
vec2 st;

vec3 generateColor(float hue, float luminance){
    
    float S = 0.;
	float L = kL * sqrt(luminance*100.);
    
    float H = hue + 19.06;
    
    if (L >= 73. || L == 0.) {
    	S = 0.;
    } else if (73. > L && L > 57.) {
    	S = 93.727325 - maxS * (L - 57.) / 16.;
    } else if (57. >= L) {
    	S = L * maxS / 57.;
    }
    
    float U = S * cos(H * PI / 180.);
	float V = S * sin(H * PI / 180.);
    
    float X, Y, Z;
	L *= 2.;
    
    if (L != 0.) {
        float un = 0.2009;
        float vn = 0.4610;
        float Xn = 0.312713;
        float Yn = 0.329016;
        float u = U / (13.0 * L) + un;
        float v = V / (13.0 * L) + vn;
        if (L <= 8.) {
        	Y = Yn * L * k;
        } else {
        	Y = Yn * pow((L + 16.) / 116., 3.);
        }
        X = (Y * 9. * u) / (4. * v);
        Z = Y * (12. - 3. * u - 20. * v) / (4. * v);
    } else {
        X = 0.;
        Y = 0.;
        Z = 0.;
    }
    
    float R = +3.2406*X -1.5372*Y -0.4986*Z;
	float G = -0.9689*X +1.8758*Y +0.0415*Z;
	float B = +0.0555*X -0.2040*Y +1.0570*Z;
    
    R = R > 1. ? 1. : R;
    G = G > 1. ? 1. : G;
    B = B > 1. ? 1. : B;
    
    R = R < 0. ? 0. : R;
    G = G < 0. ? 0. : G;
    B = B < 0. ? 0. : B;
    
    return vec3(R, G, B);
}

void main() {
    st = gl_FragCoord.xy/u_resolution.xy;
    st.x *= u_resolution.x/u_resolution.y;
    
    float hue = st.x*360.;
    float luminance = st.y;
    
    vec3 color = vec3(luminance);

    color = generateColor(hue , luminance); 
    

    gl_FragColor = vec4(color,1.0);
}