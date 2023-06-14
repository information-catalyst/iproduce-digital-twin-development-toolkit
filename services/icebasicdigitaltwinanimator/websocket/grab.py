import numpy as np
import cv2
from ar_markers import detect_markers

# termination criteria
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)

# prepare object points, like (0,0,0), (1,0,0), (2,0,0) ....,(6,5,0)
objp = np.zeros((6*7,3), np.float32)
objp[:,:2] = np.mgrid[0:7,0:6].T.reshape(-1,2)

# Arrays to store object points and image points from all the images.
objpoints = [] # 3d point in real world space
imgpoints = [] # 2d points in image plane.

cams=0
cap =[]
while(1):
	capn = cv2.VideoCapture(cams)
	ret, frame = capn.read()
	if(ret):
		cap.append(capn)
		cams = cams + 1
	else:
		break

count = 0;
while(True):
	# Capture frame-by-frame
	ret, img = cap[0].read()
	if(ret):
	    gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

	    # Find the chess board corners
	    ret, corners = cv2.findChessboardCorners(gray, (7,6),None)

	    # If found, add object points, image points (after refining them)
	    if ret == True:
	        objpoints.append(objp)

	        corners2 = cv2.cornerSubPix(gray,corners,(11,11),(-1,-1),criteria)
	        imgpoints.append(corners2)
	        cv2.imwrite("grabs/frame%d.jpg" % count, img)     # save frame as JPEG file
	        count += 1
	        # Draw and display the corners
	        img = cv2.drawChessboardCorners(img, (7,6), corners2,ret)
	    cv2.imshow("name",img)


	if cv2.waitKey(1) & 0xFF == ord('q'):
		break

# When everything done, release the capture
for x in range(0,cams):
	cap[x].release()
cv2.destroyAllWindows()
