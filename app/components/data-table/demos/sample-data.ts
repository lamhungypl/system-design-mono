export interface Person {
  key: string
  name: string
  age: number
  role: "Engineer" | "Designer" | "PM" | "Analyst"
  status: "Active" | "Invited" | "Paused"
  city: string
  joined: string
}

export const people: Person[] = [
  { key: "1", name: "Ada Lovelace", age: 36, role: "Engineer", status: "Active", city: "London", joined: "2023-02-11" },
  { key: "2", name: "Alan Turing", age: 41, role: "Engineer", status: "Active", city: "Manchester", joined: "2022-07-19" },
  { key: "3", name: "Grace Hopper", age: 85, role: "Engineer", status: "Paused", city: "New York", joined: "2021-11-03" },
  { key: "4", name: "Katherine Johnson", age: 101, role: "Analyst", status: "Active", city: "Hampton", joined: "2020-04-23" },
  { key: "5", name: "Hedy Lamarr", age: 36, role: "Designer", status: "Invited", city: "Vienna", joined: "2024-01-15" },
  { key: "6", name: "Marie Curie", age: 66, role: "Analyst", status: "Active", city: "Paris", joined: "2019-09-02" },
  { key: "7", name: "Linus Torvalds", age: 54, role: "Engineer", status: "Active", city: "Helsinki", joined: "2022-03-11" },
  { key: "8", name: "Margaret Hamilton", age: 87, role: "Engineer", status: "Paused", city: "Boston", joined: "2023-06-21" },
  { key: "9", name: "Donald Knuth", age: 86, role: "Analyst", status: "Active", city: "Stanford", joined: "2020-12-18" },
  { key: "10", name: "Radia Perlman", age: 72, role: "Engineer", status: "Active", city: "Boston", joined: "2021-08-07" },
  { key: "11", name: "Tim Berners-Lee", age: 68, role: "PM", status: "Invited", city: "London", joined: "2024-03-30" },
  { key: "12", name: "Barbara Liskov", age: 84, role: "Engineer", status: "Active", city: "Cambridge", joined: "2022-10-05" },
]
