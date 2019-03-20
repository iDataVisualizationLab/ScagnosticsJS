# ScagnosticsJS API Reference
There are [2D](#2d-version), [3D](#3d-version), and [nD](#nd-version) versions of the ScagnosticsJS library correspondingly.
## Scagnostics playgrounds (online demos)
You can use these playground pages to explore the underlying scagnostics calculation processes and the visualizations of their intermediate results. They contain exemplar scatterplots for each of the 9 scagnostics (outlying, skewed, clumpy, sparse, striated, convex, skinny, stringy, and monotonic) scores for you to explore:
 
2D: https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics

3D: https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics3d/

nD: https://idatavisualizationlab.github.io/Scagnostics2018/scagnosticsnd/

## Research paper
To cite ScagnosticsJS please cite (will be updated here)

## [2d Version](#2d-version)
### Installation
#### Download
You can download `scagnostics.js` from [here](https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics/build/js/scagnostics.min.js)
#### CDN
You can add `scagnostics.js` to your web page using this code snippet:
```html
<script type="text/javascript" src="https://idatavisualizationlab.github.io/Scagnostics2018/scagnostics/build/js/scagnostics.min.js"></script>
``` 
### Creating new scagnostics object
You will need to pass an array of 2d scatter plot points as `[[x1, y1], [x2, y2], [x3, y3], [x4, y4],...[xn, yn]]`. You may use default scagnostics options or you can optionally pass an `options` object with one or combination of the following fields
* `binType`: as 'leader' (default) or 'hexagon' to use leader binning or hexagon binning correspondingly
* `startBinGridSize`: default is `40`, an integer to start the binning process with (it starts with 40x40 bins in this case).
* `isNormalized`: default is `false`, if it is `true` then ScagnosticsJS will skip the normalizastion step to speed up the calculation time.    
* `isBinned`: default is `false`, if it is `true` then ScagnosticsJS will skip the binning step to speed up the calculation time.
* `outlyingUpperBound`: default is `undefined`, you may specify this outlying upper bound value to decide if a length of the Minimum Spanning Tree, built in the process of scagnostics calculation, is outlying or not.
* `minBins`: default is `50`, this is the minimum number of bins that you expect to have after binning process.
* `maxBins`: default is `250`, this is the maximum number of bins that you expect to have after binning process.

#### Sample code for the default `options` case
```javascript
    //Create a random sed of 2d points
    let points = [];
    for (let i = 0; i < 100; i++) {
        let x = i* (3*pi/100);
        let y = sin(x);
        points.push([x+random()/100, y+random()/100]);
    }
    //Create scagnostics object
    let scag = scagnostics(points); 
```
#### Sample code if you use options
```javascript
    //Create a random sed of 2d points
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
* `scag.bins` will return all the `bins` 
#### Binning information

#### Outlying score and related intermediate results
#### Skewed score and related intermediate results
#### Clumpy score and related intermediate results
#### Sparse score and related intermediate results
#### Striated score and related intermediate results
#### Convex score and related intermediate results
#### Skinny score and related intermediate results
#### Stringy score and related intermediate results
#### Monotonic score and related intermediate results

