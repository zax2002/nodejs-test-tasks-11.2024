import { z, ZodRawShape } from "zod";
import zodToJsonSchema from "zod-to-json-schema";


export const zodToJson = <M extends ZodRawShape>(
  models: M
) => {
  const zodSchema = z.object(models);

  const $id = Object.keys(models).join('_');
  
  const zodJsonSchema = zodToJsonSchema(zodSchema, {
    basePath: [`${$id}#`],
    errorMessages: true,
  });

  const jsonSchema = {
    $id,
    ...zodJsonSchema,
  };

  const $ref = <M>(key: string | any) => {
    const $ref = `${$id}#/properties/${
      typeof key === `string` ? key : key.key
    }`;
    return typeof key === `string`
      ? {
          $ref,
        }
      : {
          $ref,
          description: key.description,
        };
  };

  const result = {
    schemas: [jsonSchema],
    $ref,
  };

  return result;
}