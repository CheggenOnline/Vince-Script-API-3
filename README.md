# Vince-Script-API-3
Vince Script API 3

Content in this package:
* Vince_Modal (V1.4)
* Vince_Script_API_3 (V1.0)
* Code-folder: This contains the typescript files for the two scripts, in case anyone wants to have a look

Install:
* Go to: M3 > H5 Administration Tools > H5 Administration > Data files
* "Change file type" => H5 Script
* Click "Import Zip"
* Select the zipfile "UPLOAD ME"
* Click "OK" when asked if you want to import the file
* IF Zip upload fails, unpack the folder and upload the 2 files separately using the "upload" button


Usage:
* add the script as a shortcut in the program where you want to use it
* OBS! If you want to use the script multiple times in the same panel, Make sure to give each instance of the script a unique argument in that panel (for instance a number)

Other:
* The script automatically stores its own usage information in cugex (Update_Usage_information()), using this structure
  	* FILE (Table): V_USAGE
	* PK01: Script Name
	* PK02: Program Panel Name
	* A030: Time first run
	* A130: # runs
	* A230: last run
	* A330: last runned by
	

* The Script also stores its configuration info in cugex, using this structure:
	* FILE: V_SCRIPT
	* PK01: this.PK01
	* PK02: Program Panel Name
	* PK03: Script Key (from argument)
	* A121: Records
	* A030: API program + transaction
	* A130 - A930: API field name : field (where to get value) : field Length : field Type : label Text


