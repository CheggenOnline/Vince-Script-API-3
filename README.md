# Vince-Script-API-3
Vince Script API 3

The solutions consits of two scripts. The main script, Vince_Script_API_3, and a support script "Vince_Modal" that is used by the main script.
To use the solution, both javascript files must be uploaded to the script database.
In addition to these files you will also find the typescript files in this folder. These are included for reference so that those who wants to use parts of the code in their own scripts can do that.

Disclaimer:
This script is provided as-is and may be used at your own risk. Neither Vince nor Christian Heggen is responsible for maintaining, supporting, or ensuring the accuracy or reliability of this script.

Install:
* Go to: M3 > H5 Administration Tools > H5 Administration > Data files
* "Change file type" => H5 Script
* Click "Import" and then "OK"
* Do this for both .js files

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


