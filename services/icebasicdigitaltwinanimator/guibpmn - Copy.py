try:
    # for Python2
    from Tkinter import *   ## notice capitalized T in Tkinter 
except ImportError:
    # for Python3
    from tkinter import *   ## notice lowercase 't' in tkinter here

tkroot = Tk()
frame = Frame(tkroot)
frame.pack()

bottomframe = Frame(tkroot)
bottomframe.pack( side = BOTTOM )

redbutton = Button(frame, text="Red", fg="red")
redbutton.pack( side = LEFT)

greenbutton = Button(frame, text="Brown", fg="brown")
greenbutton.pack( side = LEFT )

bluebutton = Button(frame, text="Blue", fg="blue")
bluebutton.pack( side = LEFT )


var = StringVar()
label = Label( frame, textvariable=var, relief=RAISED )
var.set("Hey!? How are you doing?")
label.pack(side = LEFT)

spinvar = StringVar()
spinvar.set("7")
w = Spinbox(frame, from_=1, to=10, textvariable=spinvar)
w.pack(side = LEFT)




blackbutton = Button(bottomframe, text="Black", fg="black")
blackbutton.pack( side = BOTTOM)

tkroot.mainloop()