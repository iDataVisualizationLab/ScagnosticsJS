# ScagnosticsJS API Reference
There are [2D](#2d-version), [3D](#3d-version), and [nD](#nd-version) versions of the ScagnosticsJS library correspondingly.
## Scagnostics playgrounds (online demos)
You can use these playground pages to explore the underlying scagnostics calculation processes and the visualizations of their intermediate results. They contain exemplar scatterplots for each of the 9 scagnostics (outlying, skewed, clumpy, sparse, striated, convex, skinny, stringy, and monotonic) scores for you to explore:
 
2D: https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics

3D: https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics3d/

nD: https://idatavisualizationlab.github.io/Scagnostics2018/scagnosticsnd/


## [2D Version](#2d-version)
### Installation
#### Download
You can download `scagnostics.js` from [here](https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics/build/js/scagnostics.min.js)
#### CDN
You can add `scagnostics.js` to your web page using this code snippet:
```html
<script type="text/javascript" src="https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics/build/js/scagnostics.min.js"></script>
``` 
### Creating new scagnostics object
You will need to pass an array of 2D scatter plot points as `[[x1, y1], [x2, y2], [x3, y3], [x4, y4],...[xn, yn]]`. If you would like to pass some data (say `ids` of the points) then you may pass them as `data` attribute of the point. This `data` field will then be passed into the result after normalization or binning, so you could use this to get back the original point.

You may use default scagnostics options or you can optionally pass an `options` object with one or combination of the following fields
* `binType`: as `'leader'` (default) or `'hexagon'` to use leader binning or hexagon binning correspondingly
* `startBinGridSize`: default is `40`, an integer to start the binning process with (it starts with 40x40 bins in this case).
* `isNormalized`: default is `false`, if it is `true` then ScagnosticsJS will skip the normalizastion step to speed up the calculation time.    
* `isBinned`: default is `false`, if it is `true` then ScagnosticsJS will skip the binning step to speed up the calculation time.
* `outlyingUpperBound`: default is `undefined`, you may specify this outlying upper bound value to decide if a length of the Minimum Spanning Tree, built in the process of scagnostics calculation, is outlying or not.
* `minBins`: default is `50`, this is the minimum number of bins that you expect to have after binning process.
* `maxBins`: default is `250`, this is the maximum number of bins that you expect to have after binning process.

#### Sample code without `options` (default options)
```javascript
    //Create an array of random 2D points
    let points = [];
    for (let i = 0; i < 100; i++) {
        let x = i* (3*pi/100);
        let y = sin(x);
        points.push([x+random()/100, y+random()/100]);
    }
    //Create scagnostics object
    let scag = scagnostics(points); 
```
#### Sample code with `options`
```javascript
    //Create an array of 2D random points
    let points = [];
    for (let i = 0; i < 100; i++) {
        let x = i* (3*pi/100);
        let y = sin(x);
        points.push([x+random()/100, y+random()/100]);
    }
    //Set the scagnostics options
    const options = {
        binType: 'leader',
        startBinGridSize: 20,
        isNormalized: false,
        isBinned: false,
        outlyingUpperBound: undefined,
        minBins: 50,
        maxBins: 250
    };
    let scag = scagnostics(points, options); 
```
#### Normalized points
* `scag.normalizedPoints` returns an array of 2D points after normalized to the range `[0, 1]`. Each point will contain a `data` field that passed from the original point (if you assigned one), so you could use to get back the information from the original point.
#### Binning information
* `scag.bins` will return all the `bins`. A `bin` contains an array of points belonging to that bin and `x`, `y` attributes for the location (center) of the bin.

#### Outlying score
* `scag.outlyingScore` returns the scagnostics outlying score.
#### Skewed score
* `scag.skewedScore` returns the scagnostics skewed score.
#### Clumpy score
* `scag.clumpyScore` returns the scagnostics clumpy score.
#### Sparse score
* `scag.sparseScore` returns the scagnostics sparse score.
#### Striated score
* `scag.striatedScore` returns the scagnostics striated score.
#### Convex score
* `scag.convexScore` returns the scagnostics convex score.
#### Skinny score
* `scag.skinnyScore` returns the scagnostics stringy score.
#### Stringy score
* `scag.stringyScore` returns the scagnostics stringy score.
#### Monotonic score
* `scag.monotonicScore` returns the scagnostics monotonic score.

## [3D Version](#3d-version)
### Installation
#### Download
You can download `scagnostics3d.js` from [here](https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics3d/build/js/scagnostics3d.min.js)
#### CDN
You can add `scagnostics3d.js` to your web page using this code snippet:
```html
<script type="text/javascript" src="https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics3d/build/js/scagnostics3d.min.js"></script>
``` 
### Creating new scagnostics3d object
You will need to pass an array of 3D scatter plot points as `[[x1, y1, z1], [x2, y2, z2], [x3, y3, z3], [x4, y4, z4],...[xn, yn, zn]]`. If you would like to pass some data (say `ids` of the points) then you may pass them as `data` attribute of the point. This `data` field will then be passed into the result after normalization or binning, so you could use this to get back the original point.

You may use default scagnostics options or you can optionally pass an `options` object with one or combination of the following fields
* `binType`: as `'leader'` (default), currently only `'leader'` binning is supported.
* `startBinGridSize`: default is `40`, an integer to start the binning process with (it starts with 40x40x40 bins in this case).
* `isNormalized`: default is `false`, if it is `true` then ScagnosticsJS will skip the normalizastion step to speed up the calculation time.    
* `isBinned`: default is `false`, if it is `true` then ScagnosticsJS will skip the binning step to speed up the calculation time.
* `outlyingUpperBound`: default is `undefined`, you may specify this outlying upper bound value to decide if a length of the Minimum Spanning Tree, built in the process of scagnostics calculation, is outlying or not.
* `minBins`: default is `30`, this is the minimum number of bins that you expect to have after binning process.
* `maxBins`: default is `200`, this is the maximum number of bins that you expect to have after binning process.

#### Sample code without `options` (default options)
```javascript
    //Create an array of random 3D points
    let noise = ()=> Math.random()/10;
        let points = [];
        for (let x = 0; x < 150; x++) {
            points.push([x + noise(), Math.sin(x * Math.PI / 20) + noise(), Math.cos(x * Math.PI / 20) + noise()])
        };
    //Create scagnostics object
    let scag = scagnostics3d(points); 
```
#### Sample code with `options`
```javascript
    //Create an array of random 3D points
    let noise = ()=> Math.random()/10;
        let points = [];
        for (let x = 0; x < 150; x++) {
            points.push([x + noise(), Math.sin(x * Math.PI / 20) + noise(), Math.cos(x * Math.PI / 20) + noise()])
        };
    //Set the scagnostics options
    const options = {
        binType: 'leader',
        startBinGridSize: 20,
        isNormalized: false,
        isBinned: false,
        outlyingUpperBound: undefined,
        minBins: 30,
        maxBins: 200
    };
    let scag = scagnostics3d(points, options); 
```
#### Normalized points
* `scag.normalizedPoints` returns an array of 3d points after normalized to the range `[0, 1]`. Each point will contain a `data` field that passed from the original point (if you assigned one), so you could use to get back the information from the original point.
#### Binning information
* `scag.bins` will return all the `bins`. A `bin` contains an array of points belonging to that bin and `x`, `y`, `z` attributes for the location (center) of the bin.

#### Outlying score
* `scag.outlyingScore` returns the scagnostics outlying score.
#### Skewed score
* `scag.skewedScore` returns the scagnostics skewed score.
#### Clumpy score
* `scag.clumpyScore` returns the scagnostics clumpy score.
#### Sparse score
* `scag.sparseScore` returns the scagnostics sparse score.
#### Striated score
* `scag.striatedScore` returns the scagnostics striated score.
#### Convex score
* `scag.convexScore` returns the scagnostics convex score.
#### Skinny score
* `scag.skinnyScore` returns the scagnostics stringy score.
#### Stringy score
* `scag.stringyScore` returns the scagnostics stringy score.
#### Monotonic score
* `scag.monotonicScore` returns the scagnostics monotonic score.

## [nD Version](#nd-version)
### Installation
#### Download
You can download `scagnosticsnd.js` from [here](https://idatavisualizationlab.github.io/Scagnostics2018/scagnosticsnd/build/js/scagnosticsnd.min.js)
#### CDN
You can add `scagnosticsnd.js` to your web page using this code snippet:
```html
<script type="text/javascript" src="https://idatavisualizationlab.github.io/Scagnostics2018/scagnosticsnd/build/js/scagnosticsnd.min.js"></script>
``` 
### Creating new scagnosticsnd object
You will need to pass an array of nD scatter plot points as `[[x1, y1, z1, ...], [x2, y2, z2, ...], [x3, y3, z3, ...], [x4, y4, z4, ...], ... [xn, yn, zn, ...]]`. If you would like to pass some data (say `ids` of the points) then you may pass them as `data` attribute of the point. This `data` field will then be passed into the result after normalization or binning, so you could use this to get back the original point.

You may use default scagnostics options or you can optionally pass an `options` object with one or combination of the following fields
* `binType`: as `'leader'` (default), currently only `leader` binning is supported.
* `startBinGridSize`: default is `20`, an integer to start the binning process with (it starts with 40x40x40... bins in this case). For high number of dimensions, the number of bins to start with increases exponentially, so consider reducing this number for better performance.
* `isNormalized`: default is `false`, if it is `true` then ScagnosticsJS will skip the normalizastion step to speed up the calculation time.    
* `isBinned`: default is `false`, if it is `true` then ScagnosticsJS will skip the binning step to speed up the calculation time.
* `outlyingUpperBound`: default is `undefined`, you may specify this outlying upper bound value to decide if a length of the Minimum Spanning Tree, built in the process of scagnostics calculation, is outlying or not.
* `minBins`: default is `30`, this is the minimum number of bins that you expect to have after binning process.
* `maxBins`: default is `200`, this is the maximum number of bins that you expect to have after binning process.
* `outlyingCoefficient`: default is 3, this is used to calculate the outlying threshold on the MST lengths using this formula: `upperBound = 75<sup>th</sup> quantile + outlyingCoefficient*IQR`. We provide this option since in high dimensional data the default formula `upperBound = 75<sup>th</sup> quantile + 3*IQR` may not work in detecting outlier.
* `incrementA`: default is 2, in high dimension data, number of bins will change dramatically if we change the bin grid size, therefore, we can use the formula `binSize = incrementA*binSize + incrementB` to control the increment of the `binSize`.
* `incrementB`: default is 0, explained in `incrementA` section.
* `decrementA`: default is 1/2, in high dimension data, number of bins will change dramatically if we change the bin grid size, therefore, we can use the formula `binSize = decrementA*binSize + decrementB` to control the decrement of the `binSize`.
* `decrementB`: default is 0, explained in `incrementA` section.
* `distanceWeights`: default is 1 for every dimension. In high dimensional data, we may need the option to control the weights of each dimension in the contribution to the distance calculation among points. In this case we can specify this as an array, a value in range [0, 1] represents the weight of the corresponding dimension in distance calculation. E.g., `[0.5, 1, 1, 1, 1, 1, 0.5]` means that there are 7 dimensions and the first and last have the weights of 0.5 in calculating distances.  


#### Sample code without `options` (default options)
```javascript
    /***********RANDOM DATA*******************/
    let random = Math.random,
        points = [];
    //100 data points
    for (let i = 0; i < 100; i++) {
        //each point of 10 dimensions
        let point = [];
        for (let j = 0; j < 10; j++) {
            point.push(random());
        }
        points.push(point);
    }
    //Create scagnostics object
    let scag = scagnosticsnd(points); 
```
#### Sample code with `options`
```javascript
    /***********RANDOM DATA*******************/
    let random = Math.random,
        points = [];
    //100 data points
    for (let i = 0; i < 100; i++) {
        //each point of 10 dimensions
        let point = [];
        for (let j = 0; j < 10; j++) {
            point.push(random());
        }
        points.push(point);
    }
    //Create options
    let options = {
        startBinGridSize: 30,
        minBins: 30,
        maxBins: 100,
        outlyingCoefficient: 0.5,
        incrementA: 1,
        incrementB: 5,
        decrementA: 0.9,
        decrementB: 0,
        distanceWeights: [0.5, 0.5, 0.5, 1, 1, 1, 1, 1, 1, 0.5]
    };
    let scag = scagnostics3d(points, options); 
```
#### Normalized points
* `scag.normalizedPoints` returns an array of nD points after normalized to the range `[0, 1]`. Each point will contain a `data` field that passed from the original point (if you assigned one), so you could use to get back the information from the original point.
#### Binning information
* `scag.bins` will return all the `bins`. A `bin` contains an array of points belonging to that bin and `x`, `y`, `z`, ... attributes for the location (center) of the bin.

#### Outlying score
* `scag.outlyingScore` returns the scagnostics outlying score.