import { flags, SfdxCommand } from '@salesforce/command';
import { Messages, SfdxError } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';

// Initialize Messages with the current plugin directory
Messages.importMessagesDirectory(__dirname);

// Load the specific messages for this file. Messages from @salesforce/command, @salesforce/core,
// or any library that is using the messages framework can also be loaded this way.
const messages = Messages.loadMessages('orgChangesTracker', 'org');

export default class Org extends SfdxCommand {

  public static description = messages.getMessage('commandDescription');

  public static examples = [
  `$ sfdx audit:org -u ORG_USER_NAME --howmany 3`
  ];

  public static args = [{name: 'file'}];

  protected static flagsConfig = {
    howmany: flags.integer({description: 'Number of days of changes',  min: 1, max: 30})
  
  };

  // Comment this out if your command does not require an org username
  protected static requiresUsername = true;

  // Comment this out if your command does not support a hub org username
  protected static supportsDevhubUsername = true;

  // Set this to true if your command requires a project workspace; 'requiresProject' is false by default
  protected static requiresProject = false;

  public async run(): Promise<AnyJson> {

    // this.org is guaranteed because requiresUsername=true, as opposed to supportsUsername
    const conn = this.org.getConnection();

    const queryAuditTrail = 'Select Action, Display,Section, createdby.name, createddate from SetupAuditTrail where createddate=LAST_N_DAYS:'+ this.flags.howmany;

     // The type we are querying for
     interface AuditTrail {
      Action: string;
      Display: string;
      createddate:Date;
    }   
    let outputString = `Hello`;

      // Query the org
      const setupAuditTrailResult = await conn.query<AuditTrail>(queryAuditTrail);
      let setOfChanges = new Set();
      for(let audit of setupAuditTrailResult.records){
        setOfChanges.add(audit.Display);
      }
      
      for(let change of setOfChanges){
        this.ux.log(change);
      }

    // Return an object to be displayed with --json
    return { orgId: this.org.getOrgId(), outputString };
  }
}
