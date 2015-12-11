#!/bin/bash -ev

app="chargeback"

### Move .git out of the App dir
mv $SPLUNK_HOME/etc/apps/$app/.git /tmp/.
mv $0 /tmp/`basename $0`

### Package App
$SPLUNK_HOME/bin/splunk package app $app

### Mave .git back into the App
mv $SPLUNK_HOME/etc/system/static/app-packages/$app.spl ~/

### Move the file to the desktop, rename it and fix permissions
mv /tmp/.git $SPLUNK_HOME/etc/apps/$app/.git
mv /tmp/`basename $0` $0

exit 0
