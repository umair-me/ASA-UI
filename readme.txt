pvm model doesnt update vat view when update in bus controller, this needs to be changed to 
define model in app.js and share across other controllers to keep data consistent 


20/07/2017
========================
applied cache=false on route level for return its working but we have to implement the periodManager
factory to resolve this may be later during refactoring  


TODO:// implement login section 
update: done, implelemt forgot pwd seciton ref link below
https://docs.microsoft.com/en-us/azure/app-service-web/sendgrid-dotnet-how-to-send-email


TODO:// implement percentage calc on dashboard 




Deplyment Procedure to andriod:
==============================

1) Build as release mode, shoukd see .apk file under release folder in bin 
2) Create keystore using this link https://taco.visualstudio.com/en-us/docs/tutorial-package-publish-readme/
3) Sign the file jarsigned using this command, 
C:\Program Files (x86)\Android\android-sdk\build-tools\23.0.1>jarsigner -verbose
 -sigalg SHA1withDSA -digestalg SHA1 -keystore C:\my-release-key.keystore "C:\Te
mp\ASA.UI\ASA.UI\bin\Android\Release\android-release-unsigned.apk" JohnS

4) Zip slign using this 

C:\Program Files (x86)\Android\android-sdk\build-tools\23.0.1>jarsigner -verbose
 -sigalg SHA1withDSA -digestalg SHA1 -keystore C:\my-release-key.keystore "C:\Te
mp\ASA.UI\ASA.UI\bin\Android\Release\android-release-unsigned.apk" JohnS

5) upload file to bluestacks 
