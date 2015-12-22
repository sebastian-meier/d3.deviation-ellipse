# d3.deviation-ellipse
Calculating and drawing a standard deviation ellipse for two dimensional data using d3.

![Deviation Ellipse](https://raw.githubusercontent.com/sebastian-meier/d3.deviation-ellipse/master/thumbnail.png)

##Usage

```
var devellipse = new devellipse();
var errEllipse = devellipse.data([[x1,y1],[x2,y2],...]);

//Radius - X
errEllipse.rx

//Radius - Y
errEllipse.ry

//Center - X
errEllipse.cx

//Center - Y
errEllipse.cy

//Center - orientation (in degrees)
errEllipse.orient

```

##Examples

A visualization of spatially distributed tags from instagram images:
http://prjcts.sebastianmeier.eu/deviationellipse/example/instagram.html

Random set of pionts:
http://prjcts.sebastianmeier.eu/deviationellipse/example/random.html