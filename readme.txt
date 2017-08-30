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

TODO://implement version of app
TODO://


Deplyment Procedure to andriod:
==============================

1) Build as release mode, shoukd see .apk file under release folder in bin 
2) Create keystore using this link https://taco.visualstudio.com/en-us/docs/tutorial-package-publish-readme/
3) Sign the file jarsigned using this command, 

CD C:\Program Files\Java\jdk1.8.0_141\bin>
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore C:\asa-release-key.keystore "C:\Temp\ASA.UI\ASA.UI\bin\Android\Release\android-release-unsigned.apk" asa


4) Zip slign using this 

C:\Program Files (x86)\Android\android-sdk\build-tools\23.0.1>
zipalign.exe -v 4 "C:\Temp\ASA.UI\ASA.UI\bin\Android\Release\android-release-unsigned.apk" "C:\Temp\ASA.UI\ASA.UI\bin\Android\Release\asa.apk"

5) upload file to bluestacks 


