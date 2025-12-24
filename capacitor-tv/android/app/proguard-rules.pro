# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# and each project's build.gradle file.

-keep public class * extends com.getcapacitor.Plugin
-keep public class com.getcapacitor.Plugin { public *; }
-keep public class com.getcapacitor.MessageHandler { public *; }
