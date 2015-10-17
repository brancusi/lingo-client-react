/**
 * Finds the intersection point between
 *     * the rectangle
 *       with parallel sides to the x and y axes
 *     * the half-line pointing towards (x,y)
 *       originating from the middle of the rectangle
 *
 * Note: the function works given min[XY] <= max[XY],
 *       even though minY may not be the "top" of the rectangle
 *       because the coordinate system is flipped.
 *
 * @param (x,y):Number point to build the line segment from
 * @param minX:Number the "left" side of the rectangle
 * @param minY:Number the "top" side of the rectangle
 * @param maxX:Number the "right" side of the rectangle
 * @param maxY:Number the "bottom" side of the rectangle
 * @param check:boolean (optional) whether to treat point inside the rect as error
 * @return an object with x and y members for the intersection
 * @throws if check == true and (x,y) is inside the rectangle
 * @author TWiStErRob
 * @see <a href="http://stackoverflow.com/a/31254199/253468">source</a>
 * @see <a href="http://stackoverflow.com/a/18292964/253468">based on</a>
 */
export function aabbLine(x, y, minX, minY, maxX, maxY, check) {
    if (check && (minX <= x && x <= maxX) && (minY <= y && y <= maxY))
        throw "Point " + [x,y] + "cannot be inside "
            + "the rectangle: " + [minY, minY] + " - " + [maxX, maxY] + ".";
    var midX = (minX + maxX) / 2;
    var midY = (minY + maxY) / 2;

    var m = (midY - y) / (midX - x);

    if (x <= midX) { // check "left" side
        var minXy = m * (minX - x) + y;
        if (minY < minXy && minXy < maxY)
            return {x: minX, y: minXy};
    }

    if (x >= midX) { // check "right" side
        var maxXy = m * (maxX - x) + y;
        if (minY < maxXy && maxXy < maxY)
            return {x: maxX, y: maxXy};
    }

    if (y <= midY) { // check "top" side
        var minYx = (minY - y) / m + x;
        if (minX < minYx && minYx < maxX)
            return {x: minYx, y: minY};
    }

    if (y >= midY) { // check "bottom" side
        var maxYx = (maxY - y) / m + x;
        if (minX < maxYx && maxYx < maxX)
            return {x: maxYx, y: maxY};
    }
}
