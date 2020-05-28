console.log('resCalcClone (C)2020 Adam Wise');


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
        app['activeCamObj'] = camObj;
        var newRow = d3.select('#modelInfoTable').append('tr').classed('tableBodyRow', true);
        var firstCell = newRow.append('td')
        firstCell.append('input').property('type', 'radio');
        firstCell.append('span').text(key);
    
        newRow.append('td').text(camObj['xPixels']+' x '+camObj['yPixels']);
        newRow.append('td').text(camObj['pixelSize'])
    });
    
})


// spectrometer selection callback
d3.selectAll('.spectrometerChoiceButton')

//
function updateResults(){
    //update center wavelength on results table
    d3.select("#centerWavelengthNmTd").text(app['centerWavelength']);
    d3.select("#centerWavelengtheVTd").text(1240/app['centerWavelength']);
    
}

updateResults();