#!/bin/sh


RETURN_VALUE=
trimString()
{
        if [ -z "$1" ];then
                echo "!!!must supply the string!!!"
		else
		    string=$@
        	RETURN_VALUE=$(echo "$string" | sed 's/^[ \t]*//;s/[ \t]*$//')       
        fi
}

if [ -z "$1" ];then
	echo "!!!must supply the image path!!!"
    exit 1
fi

_pwd=`pwd`

inputfile=$1
filebasename=`basename $1`
dummy_folder=/tmp/${0##*/}
output=/app/OUT
exitcode=1

echo "inputfile is $inputfile"
echo "filebasename is $filebasename"
echo "dummy_folder is $dummy_folder"

cat /dev/null > $output

mkdir -p $dummy_folder
cp $inputfile $dummy_folder/

file=$dummy_folder/$filebasename


cd $dummy_folder

nOfThresholds=8
addThreshold=5
baseThreshold=0
suffix=${filebasename##*.}


for i in $(seq 1 $nOfThresholds)
do
	threshold=`echo "$baseThreshold + ($i*10) + $addThreshold" | bc`
	echo "binarizing file for threshold $threshold"
	tempfile=$dummy_folder/$i.$suffix
	convert $file -threshold "$threshold%" $tempfile
	tesseract $tempfile out -psm 12
	result=`cat out.txt | sed -n 's/\(.*\)\([0-9]\{2,3\}-[a-zA-Z]\{1,2\}-[0-9]\{1,6\}\)\(.*\)/\2/p'`
	echo "result: $result"
	if [ "$result" ];
	then
		RETURN_VALUE=
		trimString "$result"
		_len=`expr length "$RETURN_VALUE"`
		if [ $_len -gt 0 ];
		then
			echo "trimmed returned a string bigger than 0"
			exitcode=0
			echo "$RETURN_VALUE" > $output
			break;
		fi
	fi
	
done

cd $_pwd
return $exitcode