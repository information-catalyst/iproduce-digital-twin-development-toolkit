import json
import time
import configparser
import logging

import numpy as np
import cv2
import cv2.aruco as aruco
import glob

from navMachine import navMachine
from navMachineRoboPY import navMachineRoboPY



captureDevice = 1
firstFrame = True
targetCounter = 0
targetMarker = -1

moveModeStop = 0
moveModeForward = 1
moveModeBack = 2
moveMode = moveModeStop

config = configparser.RawConfigParser()
config.read('default.cfg')
#websocketaddress = config.get("Main","websocketaddress")
captureDevice = int(config.get("Main","captureDevice"))
cartxtip = config.get("Main","cartxtip")




def determinant(v,w):
   return v[0]*w[0]-v[1]*w[0]


def unit_vector(vector):
    """ Returns the unit vector of the vector.  """
    return vector / np.linalg.norm(vector)

def angle_between(v1, v2):
    """ Returns the angle in radians between vectors 'v1' and 'v2'::

            >>> angle_between((1, 0, 0), (0, 1, 0))
            1.5707963267948966
            >>> angle_between((1, 0, 0), (1, 0, 0))
            0.0
            >>> angle_between((1, 0, 0), (-1, 0, 0))
            3.141592653589793
    """
    v1_u = unit_vector(v1)
    v2_u = unit_vector(v2)
    return np.arccos(np.clip(np.dot(v1_u, v2_u), -1.0, 1.0))

def getNavCommand(command):
        # handle CarForward10
    global moveMode
    logging.warning("Machine: main, getNavCommand:%s" % command)
    if command =="Task_CarForward10":
        logging.warning("Machine: carnav, getNavCommand: START" )
        moveMode = moveModeForward
    pass

def sendCommandDone():
    global navigator
    navigator.sendComandDone("Task_CarForward10","commands")
    pass

def ReachedDestination():
    global moveMode
    moveMode = moveModeStop
    sendCommandDone()

def mapArea():
    pass

def runNavigation():
    pass

def calibrate():
    global  ret, mtx, dist, rvecs, tvecs
    global  objpoints,objp,corners,corners2, criteria

    images = glob.glob('calib_images/*.jpg')

    # get calibration for camera
    for fname in images:
        print(fname)
        img = cv2.imread(fname)
        gray = cv2.cvtColor(img,cv2.COLOR_BGR2GRAY)

        # Find the chess board corners
        ret, corners = cv2.findChessboardCorners(gray, (7,6),None)

        # If found, add object points, image points (after refining them)
        if ret == True:
            objpoints.append(objp)

            corners2 = cv2.cornerSubPix(gray,corners,(11,11),(-1,-1),criteria)
            imgpoints.append(corners2)

            # Draw and display the corners
            img = cv2.drawChessboardCorners(img, (7,6), corners2,ret)


    ret, mtx, dist, rvecs, tvecs = cv2.calibrateCamera(objpoints, imgpoints, gray.shape[::-1],None,None)
    # done camera calibration


def getCameraDevices():
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
    print("Devices")
    print(str(cap))
    return cap,cams

def OLDgetNavCommand(command):
    global moveMode
    global targetCounter
    logging.warning("Machine: carnav, getNavCommand:%s" % command)
    getNavCommand(command)
    if command =="Task_CarForward10":
        logging.warning("Machine: carnav, getNavCommand: START" )
        targetCounter = 0
        moveMode = moveModeForward


# might try raising custom execptions if opencv or basic  criteria for computer vision are not met
# try.... raise CustomError  ... except CustomError
#class CustomError(Exception):
#    pass


#navigator  = navMachine(getNavCommand)
navigator  = navMachineRoboPY(getNavCommand, cartxtip)



# termination criteria
criteria = (cv2.TERM_CRITERIA_EPS + cv2.TERM_CRITERIA_MAX_ITER, 30, 0.001)

# prepare object points, like (0,0,0), (1,0,0), (2,0,0) ....,(6,5,0)
objp = np.zeros((6*7,3), np.float32)
objp[:,:2] = np.mgrid[0:7,0:6].T.reshape(-1,2)

# Arrays to store object points and image points from all the images.
objpoints = [] # 3d point in real world space
imgpoints = [] # 2d points in image plane.


calibrate()

cap,cams = getCameraDevices()


while (True):
    debugImg_size = (512,512)
    debugImg = np.ones(debugImg_size) * 255
    ret, frame = cap[captureDevice].read()
    # operations on the frame come here
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    aruco_dict = aruco.Dictionary_get(aruco.DICT_6X6_250)
    parameters = aruco.DetectorParameters_create()

    #lists of ids and the corners beloning to each id
    corners, ids, rejectedImgPoints = aruco.detectMarkers(gray, aruco_dict, parameters=parameters)
    font = cv2.FONT_HERSHEY_SIMPLEX #font for displaying text (below)


    if np.all(ids != None):

        rvec, tvec ,_ = aruco.estimatePoseSingleMarkers(corners, 0.087, mtx, dist) #Estimate pose of each marker and return the values rvet and tvec---different from camera coefficients
        #(rvec-tvec).any() # get rid of that nasty numpy value array error

        for i in range(0, ids.size):
                aruco.drawAxis(frame, mtx, dist, rvec[i], tvec[i], 0.1)  # Draw Axis
        aruco.drawDetectedMarkers(frame, corners) #Draw A square around the markers


        n9 = -1
        n10 = -1
        n11 = -1
        n12 = -1
        ###### DRAW ID #####
        strg = ''
        for i in range(0, ids.size):
            strg += str(ids[i][0])+', '     # get a string of al captured markers

            if ids[i][0] == 9:              # get the index of the marker 9
                n9 = i
                targetVector9 = tvec[i]
            if ids[i][0] == 10:             # get the index of the marker 10
                n10 = i
                targetVector10 = tvec[i]
            if ids[i][0] == 11:             # get the index of the marker 11
                n11 = i
                targetVector11 = tvec[i]
            if ids[i][0] == 12:             # get the index of the marker 12
                n12 = i
                targetVector12 = tvec[i]

        cv2.putText(frame, "Id: " + strg, (0,64), font, 1, (0,255,0),2,cv2.LINE_AA)
        strg = ''
        #for i in range(0, ids.size):
        #    strg = str(tvec[i])
        #    cv2.putText(frame, "Id: " + strg, (0,64+(32*i)), font, 1, (0,255,0),2,cv2.LINE_AA)

        #strg = str(mtx)
        #cv2.putText(frame, "Mtx: " + strg, (0,128), font, 1, (0,255,0),2,cv2.LINE_AA)
        try:
            if targetCounter == 0:
                targetMarker = n9
                targetVector = targetVector9
            if targetCounter == 1:
                targetMarker = n11
                targetVector = targetVector11
            if targetCounter >= 2:
                targetMarker = n12
                targetVector = targetVector12
        except:
            targetVector = -1



        #if targetMarker != -1 and n10 != -1:
        if n10 != -1:
            iMtx = np.linalg.inv(mtx)
            mtxRot  = cv2.Rodrigues(rvec[n10])[0]

            if(firstFrame):
                print ("mtx:")
                print (str(mtx))
                print ("iMtx:")
                print (str(iMtx))
                print ("mtxRot:")
                print (str(mtxRot))

            iMtxRot = np.linalg.inv(mtxRot)
            #vecA = tvec[n9] - tvec[n10] 
            vecA = targetVector - tvec[n10]
            #vecB = iMtx.dot(vecA)
            #vecB = vecA @ iMtxRot
            vecB = vecA @ mtxRot
            #vecB = iMtxRot @ vecA
            #vecB = iMtx@VecA
            #vecB = vecA @ mtx
            strg = str(vecA[0][0])
            cv2.putText(debugImg, "vecA: " + strg, (0,128), font, 1, (0,255,0),2,cv2.LINE_AA)
            strg = str(vecA[0][1])
            cv2.putText(debugImg, "vecA: " + strg, (0,160), font, 1, (0,255,0),2,cv2.LINE_AA)
            strg = str(vecA[0][2])
            cv2.putText(debugImg, "vecA: " + strg, (0,192), font, 1, (0,255,0),2,cv2.LINE_AA)

            strg = str(vecB[0][0])
            cv2.putText(debugImg, "vecB: " + strg, (0,234), font, 1, (0,255,0),2,cv2.LINE_AA)
            strg = str(vecB[0][1])
            cv2.putText(debugImg, "vecB: " + strg, (0,266), font, 1, (0,255,0),2,cv2.LINE_AA)
            strg = str(vecB[0][2])
            cv2.putText(debugImg, "vecB: " + strg, (0,298), font, 1, (0,255,0),2,cv2.LINE_AA)



            #cv::projectPoints(objectPoints, Rvec, Tvec, CP.CameraMatrix, CP.Distorsion, imagePoints);
            #// draw lines of different colours
            #cv::line(Image, imagePoints[0], imagePoints[1], Scalar(0, 0, 255, 255), 1, CV_AA);
            objectPoints = np.array([[0,0,0],vecB[0]])
            #imagePoints = cv2.projectPoints(objectPoints, rvec[n10], tvec[n10], mtx, None)
            #imagePoints, jac = cv2.projectPoints(objectPoints, rvec[n10], tvec[n10], mtx, None)
            imagePoints, jac = cv2.projectPoints(objectPoints, rvec[n10], tvec[n10], mtx, dist)
            imagePoints = np.int32(imagePoints).reshape(-1,2)

            if(firstFrame):
                print(str(imagePoints[0]))
                print(str(imagePoints[1]))
            cv2.line(frame, tuple(imagePoints[0]), tuple(imagePoints[1]),(255,0,0),3)

            v2 = [0,1,0]
            v22 = [0,1]
            vB2 = [vecB[0][0],vecB[0][1]]
            angleToRotate = angle_between(vecB, v2) * 180 * 7 / 22
            cv2.putText(debugImg, "angleToRotate: " + str(angleToRotate), (0,330), font, 1, (0,255,0),2,cv2.LINE_AA)

            #a = np.array(vecB, v2)
            #a = [vecB, v2]
            #direction = np.linalg.det(a)
            #direction = determinant(vB2, v22)
            direction = 1
            if vB2[0]<0:
                direction = -1
            distance = (vB2[0] *  vB2[0]  + vB2[1] * vB2[1]) **0.5

            cv2.putText(debugImg, "direction: " + str(direction), (0,362), font, 1, (0,255,0),2,cv2.LINE_AA)
            cv2.putText(debugImg, "distance: " + str(distance), (0,394), font, 1, (0,255,0),2,cv2.LINE_AA)
            cv2.putText(debugImg, "moveMode: " + str(moveMode), (0,490), font, 1, (0,255,0),2,cv2.LINE_AA)


            if (moveMode== moveModeStop):
                navigator.stop()
            if (moveMode== moveModeForward):
                if (angleToRotate>30):
                    if(direction>0):
                        cv2.putText(debugImg, "rotateRight: ", (0,426), font, 1, (0,255,0),2,cv2.LINE_AA)
                        navigator.rotateRight()
                    else:
                        cv2.putText(debugImg, "rotateLeft: ", (0,426), font, 1, (0,255,0),2,cv2.LINE_AA)
                        navigator.rotateLeft()
                if (distance>0.10):
                    if angleToRotate < 30:
                        cv2.putText(debugImg, "moveForward: ", (0,458), font, 1, (0,255,0),2,cv2.LINE_AA)
                        navigator.moveForward()
                else:
                    targetCounter = targetCounter + 1
            if (moveMode== moveModeBack):
                pass
            if (targetCounter>2):
                ReachedDestination()

            cv2.putText(debugImg, "targetCounter: " + str(targetCounter), (0,32), font, 1, (0,255,0),2,cv2.LINE_AA)


            firstFrame = False

    else:
        ##### DRAW "NO IDS" #####
        cv2.putText(frame, "No Ids", (0,64), font, 1, (0,255,0),2,cv2.LINE_AA)

    # Display the resulting frame
    cv2.imshow('frame',frame)
    cv2.imshow("debug",debugImg)
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# shut down
# When everything done, release the capture
for x in range(0,cams):
    cap[x].release()
cv2.destroyAllWindows()