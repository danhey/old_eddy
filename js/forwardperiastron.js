function forwardPeriastron(phip, a1sini, varpi, e, period, sampling, points) {
    /*Calculates the time delay at given orbital parameters in units of
    periastron barycentric julian date, semimajor axis lightseconds, varpi (radians?), and eccentricity.
    Both orbital period and sampling rate must be in the same units. */
    var eta = sampling / period, cos_varpi = Math.cos(varpi),
        sin_varpi = Math.sin(varpi),  tauSum = 0, z = 0, numPoints = (1/points);
    
    var rvPortion = -2.0 * Math.PI * (1 / (period * 86400)) * 299792.458 * a1sini* (1/Math.sqrt(1-e*e));
    
    //Empties out previous array.
    phase.length = 0;
    
    var startPoint = parseFloat(document.getElementById("bjdStart").value)
    var endPoint = parseFloat(document.getElementById("bjdEnd").value) + 10e-8
    
    var optimisedEndPoint = startPoint + parseFloat(period) + 10e-8
    
    for (var phi = startPoint; phi<=endPoint; phi+=1) {
        tauSum = 0;
        for (n = 1; n<=50; n++){
            z = xi_n(n, e, cos_varpi, sin_varpi) * (Math.sin(n * Math.PI * eta) / (n * Math.PI * eta)) * Math.sin(
                ((2 * Math.PI * n) / period) * (phi-phip)
                + theta_n(n, e, cos_varpi, sin_varpi));
            tauSum+=z;
            if (Math.abs(z) <= 10e-8){
                break;
            }
            z = 0;
        }
        phase.push([phi, 
                    (-1 * a1sini * tauSum), 
                    (rvPortion * (cosfBjd(e,phip,phi,period)* cos_varpi - sinfBjd(e,phip,phi,period) * sin_varpi + e * cos_varpi))]);
    }
    
    // finish loop for array duplication
    
}

function cosfBjd(e,phi_p,phi,period){
  var sums = BESSEL.besselj(e,1) * Math.cos(((2 * Math.PI) / period) * (phi-phi_p));
  for (i=0; i<2; i++){
    for (n = 1; n<=Math.ceil(20+200*e*e); n++){
      sums += BESSEL.besselj(n*e,n) * Math.cos(((2 * Math.PI * n) / period) * (phi-phi_p));
    }
  }
  return (-1 * e + 2 * (1-e*e) * (1/e) * sums);
}

function sinfBjd(e,phi_p,phi,period){
  var sums = BESSEL.besselj(e,1) * Math.sin(((2 * Math.PI) / period) * (phi-phi_p));
  for (i=0; i<2; i++){
    for (n = 1; n<=(Math.ceil(20+200*e*e)); n++){
      sums += BESSEL.besselj(n*e,n) * Math.sin(((2 * Math.PI * n) / period) * (phi-phi_p));
    }
  }
  return (2 * Math.sqrt(1-e*e)*sums);
}