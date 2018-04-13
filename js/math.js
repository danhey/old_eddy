function undersampledTau(phip, a1sini, varpi, e, period, sampling, points) {

    var eta = sampling / period, cos_varpi = Math.cos(varpi),
        sin_varpi = Math.sin(varpi), tauSum = 0, z = 0, numPoints = (1/points);
    
    
    var rvPortion = -2.0 * Math.PI * (1 / (period * 86400)) * 299792.458 * a1sini* (1/Math.sqrt(1-e*e));
    //Empties out previous array.
    phase.length = 0;
    var phiEnd = 1.2+10e-8;
    
    
    //This would be faster as a decrementing while loop with two conditions - one for decreasing n and the other for abs(z)
    for (var phi = 0; phi<phiEnd; phi+=numPoints) {
        tauSum = 0;
        for (n = 1; n<=50; n++){
            z = xi_n(n, e, cos_varpi, sin_varpi) * (Math.sin(n * Math.PI * eta) / (n * Math.PI * eta)) * Math.sin(2 * Math.PI * n * (phi - phip) + theta_n(n, e, cos_varpi, sin_varpi));
            tauSum+=z;
            if (Math.abs(z) <= 10e-8){
                break;
            }
            z = 0;
        }
        //Adds to arrays. (phi, tau, rv)
        phase.push([phi, 
                    (-1 * a1sini * tauSum), 
                    (rvPortion * (cosf(e,phip,phi)* cos_varpi - sinf(e,phip,phi) * sin_varpi + e * cos_varpi))]);
    }
}


function xi_n(n, e, cos_varpi, sin_varpi) {
    var an;
    var bn;
      if (n==1) {
        an = 2 * Math.sqrt(1 - e * e) * BESSEL.besselj(e,1) / e;
        bn = 2 * dbessj(1, e);
        return (Math.sqrt((an * an) * (cos_varpi * cos_varpi) + (bn * bn) * (sin_varpi * sin_varpi)));
      } else {
        an = 2 * Math.sqrt(1 - e * e) * BESSEL.besselj(n*e,n) / e;
        bn = 2 * dbessj(n, n*e);
        return (Math.sqrt(an * an * cos_varpi * cos_varpi + bn * bn * sin_varpi * sin_varpi) / n);
      }
    }

function theta_n(n,e,cos_varpi,sin_varpi) {
    if (cos_varpi < 0) {
        return (Math.atan((e / Math.sqrt(1-e*e)) * (dbessj(n,n*e)/ BESSEL.besselj(n*e,n)) * sin_varpi/cos_varpi) + Math.PI);
    } else {
        return (Math.atan((e / Math.sqrt(1-e*e)) * (dbessj(n,n*e)/ BESSEL.besselj(n*e,n)) * sin_varpi/cos_varpi));
    }
}

function dbessj(n,x) {
  if (n==0){
    return (-1 * BESSEL.besselj(x,1));
  } else if (n==1) {
    return (BESSEL.besselj(x,0) - BESSEL.besselj(x,1)/x);
  } else if (n==2) {
    return (BESSEL.besselj(x,1) - 2 * BESSEL.besselj(x,n)/x);
  } else {
    return (BESSEL.besselj(x,n-1) - n * BESSEL.besselj(x,n)/x);
  }
}

function cosf(e,phi_p,phi){
    //speedups: order count is called every iteration loop. rewrite outside as variable
  var sums = BESSEL.besselj(e,1) * Math.cos(2*Math.PI*(phi-phi_p));
  for (i=0; i<2; i++){
    for (n = 1; n<=Math.ceil(20+200*e*e); n++){
      sums += BESSEL.besselj(n*e,n) * Math.cos(2*Math.PI*n*(phi-phi_p));
    }
  }
  return (-1 * e + 2 * (1-e*e) * (1/e) * sums);
}

function sinf(e,phi_p,phi){
  var sums = BESSEL.besselj(e,1) * Math.sin(2*Math.PI*(phi-phi_p));
  for (i=0; i<2; i++){
    for (n = 1; n<=(Math.ceil(20+200*e*e)); n++){
      sums += BESSEL.besselj(n*e,n) * Math.sin(2*Math.PI*n*(phi-phi_p));
    }
  }
  return (2 * Math.sqrt(1-e*e)*sums);
}