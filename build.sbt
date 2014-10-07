organization := "com.sandinh"

name := "open-charity"

version := "0.1"

lazy val root = (project in file(".")).enablePlugins(PlayScala)

scalaVersion := "2.11.2"

scalacOptions ++= Seq("-encoding", "UTF-8", "-deprecation", "-unchecked", "-feature", "-Yinline-warnings")

javacOptions ++= Seq("-encoding", "UTF-8", "-Xlint:unchecked", "-Xlint:deprecation")

libraryDependencies ++= Seq(
  //???
)

//@see http://www.playframework.com/documentation/2.3.x/ProductionDist
doc in Compile <<= target.map(_ / "none")
