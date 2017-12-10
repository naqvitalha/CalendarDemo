# CalenderDemo
Demo of a simple calender app built using React native.

## How to run?
```
cd CalenderDemo
npm install

react-native run-android
react-native run-ios
```

## Libraries used
[RecyclerListView](https://github.com/Flipkart/ReactEssentials) - A ListView that recycles views which makes is perfect for rendering large sets of data. It also has `initialRenderIndex` support which helps.

## Known issues
- The shared apk will work fine but if you run the code the first selected date might be off by 1 value. It gets corrected if
you scroll. This is due to a bug in RecyclerListView, [#34](https://github.com/Flipkart/ReactEssentials/issues/34)
- DataProvider for RecyclerListView in CalenderView is returning true which is a performance hit. Didn't get time to fix this.
- Events are hardcoded mostly same

## The good
- Smooth scrolls
- Low memory footprint
- Fast jumps between dates
- CROSS PLATFORM! Will work on iOS too. Followed the right guidelines that we follow @Flipkart and it just worked.

## The bad
- CalenderView scroll is not that good, data provider needs to have a valid rowHasChanged method.
- Forgot to add calender offset adjustment for CalenderView, simply slipped my mind.
- Didn't get time to add unit tests and proptype definitions.

## About Dev
Talha Naqvi is a Senior Software Development Engineer at Flipkart, correcting leading the cross platform team. He has worked
on Windows and Android in the past and is currently pursuing React Native. A performance enthusiast and most of the work
profile is also around performance. The current goal is to solve cross platform development without compromising user
experience or performance.
