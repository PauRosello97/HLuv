function handleClick() {
    // We get the input values
    let hue = parseInt(document.getElementById("hue").value);
    let luminance = parseInt(document.getElementById("luminance").value);

    // We transform them to Hex
    let color = HLuvToHex(hue, luminance);

    // We update the result
    document.getElementById("color").innerHTML = color;
    document.getElementById('colorBox').style.backgroundColor = color;
}

function HLuvToHex(hue, luminance) {
    const k = 0.0011070564598794539; //(3/29)^3.
    const maxS = 93.727325; // Max Saturation.
    const kL = 7.67; // A constant to adjust the luminance curve.

    let S = 0;
    let L = kL * Math.sqrt(luminance); // From exponential to lineal luminance.

    // We add 19.06 to the hue so hue=0 is red as in the HSB mode (optional).
    const H = hue + 19.06;
    if (L >= 73 || L == 0) {
        S = 0;
    } else if (73 > L && L > 57) {
        S = 93.727325 - maxS * (L - 57) / 16;
    } else if (57 >= L) {
        S = L * maxS / 57;
    }

    // U and V values are calculated drawing a circle which radius is S
    // so we'll get the color whose distance to the center is S and
    // its position in the circle is H (hue).
    const U = S * Math.cos(H * Math.PI / 180);
    const V = S * Math.sin(H * Math.PI / 180);

    // Now we transform the LUV color into XYZ.
    let X, Y, Z;

    // We adjust luminance from a 0-50 to a 0-100 range.
    L *= 2;

    // And we do the calculations to transform the color from CIELUV to CIEXYZ
    // as the CIE has published.
    if (L != 0) {
        const un = 0.2009;
        const vn = 0.4610;
        const Xn = 0.312713;
        const Yn = 0.329016;
        const u = U / (13.0 * L) + un;
        const v = V / (13.0 * L) + vn;
        if (L <= 8) {
            Y = Yn * L * k;
        } else {
            Y = Yn * Math.pow((L + 16) / 116.0, 3);
        }
        X = (Y * 9 * u) / (4.0 * v);
        Z = Y * (12 - 3 * u - 20 * v) / (4 * v);
    } else {
        X = 0;
        Y = 0;
        Z = 0;
    }

    // Now we transform the XYZ color to RGB using the CIE documentation.
    let R = +3.2406 * X - 1.5372 * Y - 0.4986 * Z;
    let G = -0.9689 * X + 1.8758 * Y + 0.0415 * Z;
    let B = +0.0555 * X - 0.2040 * Y + 1.0570 * Z;

    // We transform the RGB range from [0-1], to [0-255] trying not to get
    // values greater than 255.
    // (The constants are not exact so we could get impossible colors).
    R = R * 255 > 255 ? 255 : R * 255;
    G = G * 255 > 255 ? 255 : G * 255;
    B = B * 255 > 255 ? 255 : B * 255;
    // We'll also delete negative values.
    R = R < 0 ? 0 : R;
    G = G < 0 ? 0 : G;
    B = B < 0 ? 0 : B;

    // If you want to work with RGB mode, stop here.
    // But sometimes is easier to work with HEX mode so now we'll
    // transform our color from RGB to HEX.
    let hexR = Math.round(R).toString(16);
    let hexG = Math.round(G).toString(16);
    let hexB = Math.round(B).toString(16);
    hexR = hexR.length == 1 ? "0" + hexR : hexR;
    hexG = hexG.length == 1 ? "0" + hexG : hexG;
    hexB = hexB.length == 1 ? "0" + hexB : hexB;

    let color = "#" + hexR + hexG + hexB;
    return color;
}

// Pau Roselló