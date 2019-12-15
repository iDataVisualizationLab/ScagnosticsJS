/**
 * Download an object
 * @param content: the content (e.g., json object - object not necessary to be string)
 * @param fileName: the file name to be downloaded (e.g., fileName.json)
 * @param contentType: content type (e.g., "text/plain")
 */
function download(content, fileName, contentType) {
    let a = document.createElement("a");
    let file = new Blob([content], {type: contentType});
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

//Generate data.
function generateScagData(points, dataSource, options) {
    try {
        let scag = new scagnostics3d(points, options);
        let scagnosticScores = ["outlyingScore", "skewedScore", "clumpyScore", "sparseScore", "striatedScore", "convexScore", "skinnyScore", "stringyScore", "monotonicScore"];
        //Also do the rectangular binary binning
        let scagResult = {
            dataSource: dataSource,
            data: points,
            scagnostics: scagnosticScores.map(score => scag[score]),
            bins: scag.bins
        }
        return scagResult;
    } catch (e) {
        return null;
    }
}

function generateDataFromTypicalSets() {
    let typeList = [
        outlyingScatterPlot,
        skewedScatterPlot,
        clumpyScatterPlot,
        sparseScatterPlot,
        striatedScatterPlot,
        convexScatterPlot,
        skinnyScatterPlot,
        stringyScatterPlot,
        monotonicScatterPlot,
    ];
    Promise.all(typeList.map(typeFunction => {
        return generateDataFromType(typeFunction, 10);
    })).then(function (values) {
        download(JSON.stringify(values), "ScagnosticsTypicalData3d.json", "text/plain");
        console.log(values);
    });
}

async function generateDataFromType(typeFunction, size) {
    let scagData = [];
    for (let i = 0; i < size; i++) {
        let points = typeFunction();
        let scagResult = generateScagData(points, typeFunction.name, scagOptions);
        if (scagResult !== null) {
            scagData.push(scagResult);
        }
    }
    console.log(typeFunction.name + ": " + scagData.length);
    return scagData;
}

//Next two methods are used to generate data from files.
function generateDataFromDS() {
    var fileList = [
        "HPCC_21Mar_9v"
    ];
    Promise.all(fileList.map(fileName => {
        return generateDataFromFile('data/' + fileName + '.json', ['s0', 's3', 's5']);
    })).then(function (values) {
        download(JSON.stringify(values), "RealWorldData3d.json", "text/plain");
        // console.log(values);
    });
}
async function generateDataFromFile(fileName, variables) {
    let result = await d3.json(fileName).then(data => {
        let origCounter = 0;
        let augmentedCounter = 0;
        let scagData = [];
        for (let y = 0; y < data.YearsData.length; y++) {
            let yearData = data.YearsData[y];
            yearData = data.YearsData[y];
            let points = yearData[variables[0]].map((s0, i) => {
                return [s0, yearData[variables[1]][i], yearData[variables[2]][i]];
            });
            //Filter out NaN
            points = points.filter(p => !isNaN(p[0]) && !isNaN(p[1]) && !isNaN(p[2]));
            // //We augment the data with noise
            // let noise = d3.randomNormal(0, 1.0 / 40.0); //40 is the number of grid size
            // for (let i = 0; i < 10; i++) {
            //     let newPoints = points.map(p => {
            //         let p0 = p[0] + noise();
            //         let p1 = p[1] + noise();
            //         //Make sure that p0 and p1 are still in the bound
            //         p0 = (p0 < 0) ? 0 : p0;
            //         p0 = (p0 > 1) ? 1 : p0;
            //         p1 = (p1 < 0) ? 0 : p1;
            //         p1 = (p1 > 1) ? 1 : p1;
            //         return [p0, p1];
            //     });
            //     let scagResult = generateScagData(newPoints, fileName);
            //     if (scagResult !== null) {
            //         scagData.push(scagResult);
            //         augmentedCounter += 1;
            //     }
            // }
            //Also add the original scatter plot of course
            let scagResult = generateScagData(points, fileName);
            if (scagResult !== null) {
                scagData.push(scagResult);
                origCounter += 1;
            }
        }
        console.log(fileName + ": " + scagData.length + " scags, " + data.YearsData.length + ", orig: " + origCounter + ", augmented: " + augmentedCounter);
        console.log(scagData);

        return scagData;
    });
    return result;
}