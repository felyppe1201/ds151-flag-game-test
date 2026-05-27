// React
let name: string;

export function DefineUser(nomeUser: string): void {
  name = nomeUser;
  console.log(name);
  console.log("DefineUser");
}

export function GetUser(): string {
  return name;
}