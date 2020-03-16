export class AuthUserModel {constructor(
    public username: string,
    public password: string,
    public remember: boolean=false
  ) {  }
}

export class PagePermisionModel {
  public canSave: boolean;
  public canSearch: boolean;
  public canDelete: boolean;
  public canPosting: boolean;
}
