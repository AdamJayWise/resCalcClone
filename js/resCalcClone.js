console.log('resCalcClone (C)2020 Adam Wise');

// Utility functions //
function calculateTilt(obj){
    sinTilt = 10**-6 * obj.centerWavelength * obj.grooveDensity / (-2 * Math.cos( (2 * Math.PI) * obj.deviationAngle / 360  ))
    return 360 * Math.asin(sinTilt) / (2 * Math.PI)
}

function deg(angleInRadians){
    return 360 * angleInRadians / ( 2 * Math.PI )
}

function rad(angleInDegrees){
    return 2 * Math.PI * angleInDegrees / ( 360 )
}


function calcPixFactor(pixwidth){
    if (pixwidth<14) return 1
    if ( (pixwidth>=14) & (pixwidth<=50) ) return 0.4338*(pixwidth**0.3253);
    if (pixwidth>50) return 1.55
}

// rounding function with specific number of decimal places d
function r(n,d){
    return Math.round(n*10**d)/10**d;
}
// end of utility functions //

app = {
    'centerWavelength' : 500,
}; // object of global parameters

// visual clone of the andor resolution calculator GUI

// add button callbacks to the camera selector.  Each should populate the camera model table with model radio buttons
// when that button is clicked, it should update the app object with a camera model and parameters

availableModels = {
    'ixon' : {
        'iXon 897 EMCCD' : {'xPixels' : 512, 'yPixels' : 512, 'pixelSize' : 16},
        'iXon 888 EMCCD' : {'xPixels' : 1024, 'yPixels' : 1024, 'pixelSize' : 13.5},
    },

    'newton' : {
        'Newton 920 CCD' : {'xPixels' : 1024, 'yPixels' : 255, 'pixelSize' : 26},
        'Newton 940 CCD' : {'xPixels' : 2048, 'yPixels' : 512, 'pixelSize' : 13.5},
        'Newton 970 EMCCD' : {'xPixels' : 1600, 'yPixels' : 200, 'pixelSize' : 16},
        'Newton 971 EMCCD' : {'xPixels' : 1600, 'yPixels' : 400, 'pixelSize' : 16},
    },

    'istar' : {},

    'idus' : {},

    'ikonm' : {},

    'scmos' :{},
};

var cameraButtons = d3.selectAll('.cameraChoiceButton');
cameraButtons.on('click', function(d,i){
    
    console.log(this.getAttribute('value'));
    var family = this.getAttribute('value');
    app['activeFamily'] = family;

    // populate the 'select detector model' table with available detector models
    d3.select('#modelInfoTable').selectAll('.tableBodyRow').remove();
    // append a tr for each model and populate it with tds
    Object.keys(availableModels[family]).forEach(function(key){
        console.log(key)
        var camObj = availableModels[family][key];
        var newRow = d3.select('#modelInfoTable').append('tr').classed('tableBodyRow', true);
        var firstCell = newRow.append('td')
        var radio = firstCell.append('input')
            .property('type', 'radio')
            .property('name', 'camera')
            .property('value', key);
        
        radio.on('change', function(){
            app['activeCameraObj'] = camObj;
            updateResults();
        })
        firstCell.append('span').text(key);
    
        newRow.append('td').text(camObj['xPixels']+' x '+camObj['yPixels']);
        newRow.append('td').text(camObj['pixelSize'])
    });
    
})

// invoke a click for the first button
d3.select('.cameraChoiceButton').node().click();


// spectrometer selection callback
var spectrometerButtons = d3.selectAll('.spectrometerChoiceButton');
spectrometerButtons.on('click', function(d,i){
    
    console.log(this.getAttribute('value'));
    var spectrometer = this.getAttribute('value');
    app['activeSpectrometer'] = spectrometer;
    spectrometerObj = spectrometers[spectrometer];
    app['activeSpectrometerObj'] = spectrometerObj;

    // update the spectrometer parameters table
    d3.select('#spectrometerNameDisplay').text( (spectrometer + ' SPECTROGRAPH').toUpperCase() );

    // update the rows
    d3.select('#spectrometerInfoTable').selectAll('.dataRow').remove();

    var row1 = d3.select('#spectrometerInfoTable').append('tr').classed('dataRow', true);
    row1.append('td').text('Focal Length')
    row1.append('td').text(app['activeSpectrometerObj']['fl'] + ' mm');

    var row2 = d3.select('#spectrometerInfoTable').append('tr').classed('dataRow', true);
    row2.append('td').text('Aperture')
    row2.append('td').text(app['activeSpectrometerObj']['f#']);

    var row3 = d3.select('#spectrometerInfoTable').append('tr').classed('dataRow', true);
    row3.append('td').text('Grating Size')
    row3.append('td').text(app['activeSpectrometerObj']['gratingSizeX'] + ' x ' +  app['activeSpectrometerObj']['gratingSizeX'] + ' mm'   );

    

})

//invoke a click for the first button
d3.select('.spectrometerChoiceButton').node().click();


// center wavelength input callback with validation
d3.select('#centerWavelengthInput').on('change', function(){
    console.log(this.value)
    var newWavelength = Number(this.value) || 500;
    
    if (newWavelength < 0){
        newWavelength = 0;
    }
    
    if (newWavelength > 2000){
        newWavelength = 2000;
    }

    this.value = newWavelength;
    app['centerWavelength'] = newWavelength;
    updateResults();

})

//
function updateResults(){
    //update center wavelength on results table
    d3.select("#centerWavelengthNmTd").text(app['centerWavelength']);
    d3.select("#centerWavelengtheVTd").text( r(1240/app['centerWavelength'], 4) );
    
}

updateResults();