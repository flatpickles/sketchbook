import type { ParamConfig } from '../ConfigModels/ParamConfig';
import { ParamGuards } from '../ConfigModels/ParamTypes';

export enum InferenceMode {
    ProjectFile,
    ShaderFile,
    None
}

type Intentions = {
    name?: string;
    range?: [number, number];
    step?: number;
    numberValues: number[];
    booleanValues: boolean[];
    numericArrayValues: number[][];
    potentialStyleStrings: string[];
};

/**
 * ParamInference provides methods for "inferring" parameter configurations and values from inline
 * comments in project files (either ts/js or .frag shaders), evaluated in context with what we
 * already know about a given parameter (its type, and its key, if enabled) . This enables creators
 * to quickly configure the basics in a project with simple commented syntax, without needing to set
 * up detailed configs.
 */
export default class ParamInference {
    static paramAnnotations(
        paramKeys: string[],
        mode: InferenceMode,
        rawFileText: string
    ): Record<string, string> {
        if (mode === InferenceMode.None) return {};

        const lines = rawFileText.split('\n');
        const annotations: Record<string, string> = {};
        for (const line of lines) {
            for (const key of paramKeys) {
                // Find definition lines that contain the key
                const matcher =
                    mode === InferenceMode.ShaderFile
                        ? `.*uniform.*${key}`
                        : `(${key}\\s*[:=])|(this.${key}\\s*[:=])`;

                // If we find a match, extract the comment
                if (line.match(new RegExp(matcher))) {
                    const comment = line.match(/\/\/\s*(.*)/);
                    if (comment && comment.length > 1) annotations[key] = comment[1];
                    break;
                }
            }
            if (Object.keys(annotations).length === paramKeys.length) break;
        }
        return annotations;
    }

    static paramWithInference(
        initialConfig: ParamConfig,
        mode: InferenceMode,
        comment: string
    ): ParamConfig {
        if (mode === InferenceMode.None) return initialConfig;

        // Fill out a config and value with inferred values, if available
        const newConfig = { ...initialConfig };
        const intentions = this.intentionsFrom(comment);

        // Assign name token
        if (intentions?.name) {
            newConfig.name = intentions.name;
        }

        // Assign range and step tokens for numeric param types
        if (
            ParamGuards.isNumberParamConfig(newConfig) ||
            ParamGuards.isNumericArrayParamConfig(newConfig)
        ) {
            if (intentions?.range) {
                const [min, max] = intentions.range;
                newConfig.min = min;
                newConfig.max = max;
            }
            if (intentions?.step) newConfig.step = intentions.step;
        }

        // If we're parsing a shader, assign default values in supported param types
        if (mode === InferenceMode.ShaderFile) {
            // Assign number value tokens
            if (ParamGuards.isNumberParamConfig(newConfig) && intentions?.numberValues?.length) {
                newConfig.default = Number(intentions.numberValues[0]);
            }

            // Assign boolean value tokens
            if (ParamGuards.isBooleanParamConfig(newConfig) && intentions?.booleanValues?.length) {
                newConfig.default = intentions.booleanValues[0];
            }

            // Assign numeric array value tokens
            if (
                ParamGuards.isNumericArrayParamConfig(newConfig) &&
                intentions?.numericArrayValues?.length
            ) {
                newConfig.default = intentions.numericArrayValues[0];
            }
        }

        // todo: infer styles from stringTokens and the parameter key
        console.log(intentions?.potentialStyleStrings);

        return newConfig;
    }

    static intentionsFrom(parseString: string): Intentions {
        // Split on commas, not inside whitespace, ignoring commas inside square brackets
        const stringTokens = parseString.trim().split(/\s*,\s*(?![^[]*])/);

        // Collect tokens that match intention patterns
        const nameTokens = stringTokens.filter((token) => token.match(/^"([^"]*)"$/));
        const rangeTokens = stringTokens.filter((token) =>
            token.match(/^(-?\d*\.{0,1}\d+)\s*to\s*(-?\d*\.{0,1}\d+)$/)
        );
        const stepTokens = stringTokens.filter((token) =>
            token.match(/(^step\s*\d*\.{0,1}\d+$)|(^\d*\.{0,1}\d+\s*step$)/)
        );
        const numberTokens = stringTokens.filter((token) =>
            token.match(/^(-?\d*\.{0,1}\d+)(?![^[]*])$/)
        );
        const booleanTokens = stringTokens.filter((token) => token.match(/^(true|false)$/));
        const numericArrayTokens = stringTokens.filter((token) =>
            token.match(/^\[(\s*-?\d*\.{0,1}\d+\s*,\s*)+(\s*-?\d*\.{0,1}\d+\s*)\]$/)
        );
        const potentialStyleTokens = stringTokens.filter(
            (token) => token.match(/^[a-zA-Z]+$/) && !token.match(/true|false/)
        );

        // Return an object with adapted tokens, if any
        const rangeMinMax = rangeTokens?.length ? rangeTokens[0].split(/\s*to\s*/) : undefined;
        return {
            name: nameTokens?.length ? nameTokens[0].replace(/"/g, '').trim() : undefined,
            range: rangeMinMax ? [Number(rangeMinMax[0]), Number(rangeMinMax[1])] : undefined,
            step: stepTokens?.length ? Number(stepTokens[0].replace(/\s*step\s*/, '')) : undefined,
            booleanValues: booleanTokens?.length
                ? booleanTokens.map((bool) => bool === 'true')
                : [],
            numberValues: numberTokens?.length ? numberTokens.map((num) => Number(num)) : [],
            numericArrayValues: numericArrayTokens?.length
                ? numericArrayTokens.map((arrayString) =>
                      arrayString
                          .replace(/\[|\]/g, '')
                          .split(/\s*,\s*/)
                          .map((x) => Number(x))
                  )
                : [],
            potentialStyleStrings: potentialStyleTokens?.length ? potentialStyleTokens : []
        };
    }
}
