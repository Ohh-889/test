/**
 * @description
 * without changing the type’s semantics, it only prettifies the IDE display—flattening the shape so hints are easier to read.
 * @example
 * type Raw = { a: number } & { b: string };
 * type Pretty = Prettify<Raw>;
 * // => { a: number; b: string; }
 */
export type Prettify<T> = { [K in keyof T]: T[K] } & {}

export type Primitive =
  | string
  | number
  | boolean
  | bigint
  | symbol
  | null
  | undefined
  | Date
  | Function

type Join<P extends string, K extends string | number> = P extends ''
  ? `${K}`
  : `${P}.${K}`

/**
 * @example
 * type FormValues = {
 *   age: number;
 *   code: string;
 *   info: { age: number; city: string; name: string };
 *   info2: { age: number; city: string; name: string }[];
 *   phone: string;
 * };
 * type P1 = LeafPaths<FormValues>;
 * // => "age" | "code" | "phone" | "info.age" | "info.city" | "info.name" | `info2.${number}.age` | `info2.${number}.city` | `info2.${number}.name`
 */
export type LeafPaths<T, P extends string = ''> = T extends Primitive
  ? P extends ''
    ? never
    : P
  : T extends readonly (infer U)[]
    ? LeafPaths<U, Join<P, number>>
    : T extends object
      ? {
          [K in Extract<keyof T, string>]: LeafPaths<T[K], Join<P, K>>
        }[Extract<keyof T, string>]
      : never

type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ...0[]]

/**
 * @example
 * type FormValues = {
 *   age: number;
 *   code: string;
 *   info: { age: number; city: string; name: string; pl: { age: number } };
 *   info2: { age: number; city: string; name: string }[];
 *   phone: string;
 * };
 * type P1 = AllPaths<FormValues>;
 * // => "age" | "code" | "phone"|"info" | "info.age" | "info.city" | "info.name" | "info.pl" | "info.pl.age" | `info2.${number}.age` | `info2.${number}.city` | `info2.${number}.name`
 */
export type AllPaths<
  T,
  Index extends number = number,
  P extends string = '',
  Depth extends number = 6
> = [Depth] extends [never]
  ? never
  : T extends Primitive
    ? P extends ''
      ? never
      : P
    : T extends readonly (infer U)[]
      ?
          | (P extends '' ? never : P)
          | AllPaths<U, Index, Join<P, `${Index}`>, Prev[Depth]>
      : T extends object
        ?
            | (P extends '' ? never : P)
            | {
                [K in Extract<keyof T, string>]: AllPaths<
                  T[K],
                  Index,
                  Join<P, K>,
                  Prev[Depth]
                >
              }[Extract<keyof T, string>]
        : never

type OptionalIfObject<T> = T extends object
  ? T extends readonly any[]
    ? T
    : { [K in keyof T]?: T[K] }
  : T

type DeepOptionalIfObject<T> = T extends object
  ? T extends readonly any[]
    ? T
    : { [K in keyof T]: DeepOptionalIfObject<T[K]> }
  : T

type PathValue<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends `${number}` | 'number'
    ? T extends readonly (infer U)[]
      ? PathValue<U, R>
      : any
    : K extends keyof T
      ? PathValue<T[K], R>
      : any
  : P extends `${infer K}`
    ? K extends `${number}` | 'number'
      ? T extends readonly (infer U)[]
        ? U
        : any
      : K extends keyof T
        ? T[K]
        : any
    : any

/**
 * @example
 * type FormValues = {
 *   age: number;
 *   code: string;
 *   info: { age: number; city: string; name: string; pl: { age: number } };
 *   info2: { age: number; city: string; name: string }[];
 *   phone: string;
 * };
 * type P1 = PathToType<FormValues, 'age'>; // number
 * type P2 = PathToType<FormValues, 'info'>; // { age?: number; city?: string; name?: string; pl?: { city: string; name: string } | undefined }
 * type P3 = PathToType<FormValues, 'info.pl'>; // { city?: string; name?: string } | undefined
 * type P4 = PathToType<FormValues, 'info2.number'>; // { age?: number; city?: string; name?: string }   ← 数组元素对象被可选化
 * type P5 = PathToType<FormValues, 'info2.0.age'>; // number
 */
export type PathToType<T, P extends string> = OptionalIfObject<PathValue<T, P>>

/**
 * @example
 * type FormValues = {
 *   age: number;
 *   code: string;
 *   info: { age: number; city: string; name: string; pl: { age: number } };
 *   info2: { age: number; city: string; name: string }[];
 *   phone: string;
 * };
 * type P1 = PathToDeepType<FormValues, 'info'>;
 * // => { age?: number; city?: string; name?: string; pl?: { age?: number } | undefined }
 */
export type PathToDeepType<T, P extends string> = DeepOptionalIfObject<
  PathValue<T, P>
>

type DeepOptional<T> = T extends Primitive
  ? T
  : T extends readonly (infer U)[]
    ? readonly DeepOptional<U>[]
    : { [K in keyof T]?: DeepOptional<T[K]> }

export type Wrap<K extends string, V> = { [P in K]: V }

type IsNumSeg<S extends string> = S extends `${number}` | 'number'
  ? true
  : false

type BuildShape<T, P extends string> = P extends `${infer K}.${infer R}`
  ? K extends keyof T
    ? T[K] extends readonly (infer U)[]
      ? R extends `${infer I}.${infer R2}`
        ? IsNumSeg<I> extends true
          ? Wrap<
              Extract<K, string>,
              (BuildShape<U, R2> extends infer S
                ? S extends object
                  ? S
                  : never
                : never)[]
            >
          : never
        : Wrap<
            Extract<K, string>,
            (BuildShape<U, R> extends infer S
              ? S extends object
                ? S
                : never
              : never)[]
          >
      : Wrap<Extract<K, string>, BuildShape<T[K], R>>
    : never
  : P extends `${infer K}`
    ? K extends keyof T
      ? T[K] extends readonly (infer U)[]
        ? Wrap<Extract<K, string>, (U extends object ? DeepOptional<U> : U)[]>
        : T[K] extends object
          ? Wrap<Extract<K, string>, DeepOptional<T[K]>>
          : Wrap<Extract<K, string>, T[K]>
      : never
    : never

type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends (
  x: infer I
) => void
  ? I
  : never
export type MergeUnion<U> = Prettify<{
  [K in keyof UnionToIntersection<U>]: UnionToIntersection<U>[K]
}>

/**
 * @example
 * type FormValues = {
 *   age: number;
 *   code: string;
 *   info: { age: number; city: string; name: string };
 *   info2: { age: number; city: string; name: string }[];
 *   phone: string;
 * };
 * type P1 = ShapeFromPaths<FormValues, ['age','info','info2.2.city']>; // { age:number; info:{...?}; info2:{city?:string}[] }
 */
export type ShapeFromPaths<T, Ps extends readonly string[]> = Ps extends
  | never[]
  | []
  ? T
  : MergeUnion<
      Ps[number] extends infer P
        ? P extends string
          ? BuildShape<T, P>
          : never
        : never
    >

type PathsShape<
  T,
  Index extends number = number,
  P extends string = '',
  Depth extends number = 6
> = [Depth] extends [never]
  ? never
  : T extends Primitive
    ? P extends ''
      ? {}
      : { [K in P]: true }
    : T extends readonly (infer U)[]
      ? (P extends '' ? {} : { [K in P]: true }) &
          PathsShape<U, Index, Join<P, `${Index}`>, Prev[Depth]>
      : T extends object
        ? (P extends '' ? {} : { [K in P]: true }) &
            MergeUnion<
              {
                [K in Extract<keyof T, string>]: PathsShape<
                  T[K],
                  Index,
                  Join<P, K>,
                  Prev[Depth]
                >
              }[Extract<keyof T, string>]
            >
        : {}

export type AllPathsShape<T> = MergeUnion<PathsShape<T>>
export type AllPathsKeys<T> = keyof AllPathsShape<T> & string

// Utility: convert "a.b.c" into { a: { b: { c: V } } }
// "a.b.c" => { a: { b: { c: V } } }
export type KeyToNestedObject<
  K extends string,
  V
> = K extends `${infer Head}.${infer Rest}`
  ? { [P in Head]: KeyToNestedObject<Rest, V> }
  : { [P in K]: V }

// Merge {a:{b:X}} & {a:{c:Y}} => {a:{b:X;c:Y}}
export type Merge<T> = { [K in keyof T]: T[K] }

// Distribute Keys rather than taking union

/**
 * @example
 * type Inputs = {
 *   password: string;
 *   username: string;
 *   numbers: number[];
 *   users: {
 *     age: number;
 *     name: string;
 *   }[];
 * };
 * type P1 = ArrayKeys<Inputs>; // "numbers" | "users"
 */
export type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends readonly any[] ? K : never
}[keyof T] extends never
  ? any
  : {
      [K in keyof T]: T[K] extends readonly any[] ? K : never
    }[keyof T]

// Get the element type of property K; if not an array, return never
export type ArrayElementValue<T, K extends keyof T> = T[K] extends (infer U)[]
  ? U
  : any
