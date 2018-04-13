function orbitCalculator(m1, m2, period) {
    
    m1 = parseFloat(m1);
    m2 = parseFloat(m2);
    period = parseFloat(period);
    
    var massRatio = m1/m2;
    var table = document.getElementById("orbitParamTable")
    const solarMassTime =  4.925490947*(1e-6), gravitationalConstant = 6.67408e-11, c=299792458, solarMass = 1.989e30;
    
    //convert Porb to s
    period = period*86400;
    
    //find semimajor axis (ls)
    var a_psr = Math.pow((gravitationalConstant*solarMass*(period*period)*(m1+m2) / (4 * (Math.PI*Math.PI))), 1/3) * (1/c)
    
    //ls
    var a1 = a_psr*(1-(m1/(m1+m2))), a2 = a_psr*(1-(m2/(m1+m2)));
    
    
    var binaryMassFunction = Math.pow(m2, 3)/(Math.pow(m1+m2, 2));
    var binaryMassKg = binaryMassFunction * solarMass;
    var binaryMassOrbit = (Math.pow(2*Math.PI,2) * (1/solarMassTime) * Math.pow((1/period),2) * (a1*a1*a1));
    
    var resultArray = [a_psr, a1, a2, binaryMassFunction, binaryMassKg, binaryMassOrbit];
    
    for (var i = 1; i<=6; i++) {
        table.rows[i].cells[1].innerHTML = resultArray[i-1].toFixed(5); 
    }
}