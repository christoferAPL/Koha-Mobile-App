# Koha-Mobile-App
Mobile App for Koha written in React Native.
For a live example, search Android or Apple store for "Ajax Public Library"

Thank you for showing interest in this app. It is free to use any of the code in this repository, however if you do decide to use it, I ask that you mail me a non-activated library card from your system (Christofer Zorn, 55 Harwood Avenue South, Ajax Ontario Canada, L1S 2H8). I knew nothing about App development or React Native when I started this project. This will seem daunting, but it's completely doable with the existing framework in this repository.

The code is separated into three pieces and requires an activated Koha plugin:

- The code is written in React Native using Expo (https://reactnative.dev/). This was intentional as it allowed me to create the app once and publish it to both the Android and Apple Stores, without having to learn two languages.
- There is a portion that sits on a web server. This serves up information requested by the app and returns everything in JSON. All code there was written in PHP.
- There is a portion of the code that requires Koha reports to be publically accessible.

The code in this repository is in version 1.4.0. There is a separate document that outlines the features included at each step.

To utilize this code, you'll need to do the following:

- install react native on your computer.
- move the files in the react folder to your installation
- find an emulator. As I wrote this on a Windows computer, I downloaded Andriod Studio and used their emulator. If you have access to an Apple product, you can install the Expo app on that and then view the project on the same network.
- you'll need to sign up for developer accounts for both Android (fairly easy) and Apple (not as easy). 
- install the associate plugin into Koha
- Request a SIP connection

I would like to thank the following people, without their help and guidance this project would not have become a reality:
- Andrew Greene (Ajax Public Library) for suggesting the platform and answering my initial questions.
- Alisha Messado (Ajax Public Library) for her testing and providing design input.
- Lauren Wagner (Ajax Public Library) for creating the graphics used in the system.
- Nick Clemens (ByWater Solutions) for the running start he gave me in usign the Plugin, along with "I wouldn't do that if I were you" advice.
- Kyle Hall (ByWater Solutions) for the initial kick at creating our mobile app that ultimately turned into this.
- Rocio Dressler (ByWater Solutions) for her help creating some of the the reports that this app uses.
- John Wohlers for his open source SIP code

I'm more than happy to help with any questions.

Thanks!

Christofer
