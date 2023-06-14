import cv2
import cv2.aruco as aruco


'''
    drawMarker(...)
        drawMarker(dictionary, id, sidePixels[, img[, borderBits]]) -> img
'''

aruco_dict = aruco.Dictionary_get(aruco.DICT_6X6_250)
print(aruco_dict)
# second parameter is id number
# last parameter is total image size
img = aruco.drawMarker(aruco_dict, 2, 700)
cv2.imwrite("/markers/test_marker.jpg", img)

index = 0
while index < 16:
	img = aruco.drawMarker(aruco_dict, index, 700)
	cv2.imwrite("markers/test_marker%d.jpg" % index, img)
	index += 1

cv2.imshow('frame',img)
cv2.waitKey(0)