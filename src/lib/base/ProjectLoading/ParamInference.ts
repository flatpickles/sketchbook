import { ParamConfigDefaults, type ParamConfig } from '../ConfigModels/ParamConfig';
import { NumberParamConfigDefaults } from '../ConfigModels/ParamConfigs/NumberParamConfig';
import type { AnyParamValueType } from '../ConfigModels/ParamTypes';
import { ParamGuards } from '../ConfigModels/ParamTypes';

export enum InferenceMode {
    ProjectFile,
    ShaderFile
}

type Inference = {
    config: ParamConfig;
    value?: AnyParamValueType;
};

export type Inferences = {
    configs: ParamConfig[];
    values: Record<string, unknown>;
};

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
 * ParamInference provides methods for "inferring" parameter configurations and values from comments
 * in project files (either ts/js or .frag shaders), evaluated in context with what we already know
 * about a given parameter (from its type) . This enables creators to quickly configure the basics
 * in a project with simple commented syntax, without needing to set up detailed configs.
 */
export default class ParamInference {
    static paramsWithInference(
        initialConfigs: ParamConfig[],
        mode: InferenceMode,
        rawFileText: string
    ): Inferences {
        // Find param definition lines in raw file text
        const lines = rawFileText.split('\n');
        const definitionLines: Record<string, string> = {};
        for (const line of lines) {
            for (const config of initialConfigs) {
                const matcher =
                    mode === InferenceMode.ShaderFile
                        ? `.*uniform.*${config.key}`
                        : `(${config.key}\\s*[:=])|(this.${config.key}\\s*[:=])`;
                if (line.match(new RegExp(matcher))) {
                    definitionLines[config.key] = line;
                    break;
                }
            }
            if (Object.keys(definitionLines).length === initialConfigs.length) break;
        }

        // Parse param definition lines for intentions expressed in adjacent comments
        const supplementedConfigs: ParamConfig[] = [];
        const valueMap: Record<string, unknown> = {};
        for (const config of initialConfigs) {
            const definitionLine = definitionLines[config.key];
            const comment = definitionLine.match(/\/\/\s*(.*)/);
            if (comment) {
                const inference = this.paramWithInference(config, mode, comment[1]);
                supplementedConfigs.push(inference.config);
                if (inference.value !== undefined) valueMap[config.key] = inference.value;
            } else {
                supplementedConfigs.push(config);
            }
        }
        return {
            configs: supplementedConfigs,
            values: valueMap
        };
    }

    static paramWithInference(
        initialConfig: ParamConfig,
        mode: InferenceMode,
        comment: string
    ): Inference {
        // Fill out a config and value with inferred values, if available
        const newConfig = { ...initialConfig };
        let value: AnyParamValueType | undefined;
        const intentions = this.intentionsFrom(comment);

        // Assign name token
        if (
            intentions?.name &&
            (newConfig.name === newConfig.key || newConfig.name === ParamConfigDefaults.name)
        ) {
            newConfig.name = intentions.name;
        }

        // Assign range and step tokens for numeric param types
        if (
            ParamGuards.isNumberParamConfig(newConfig) ||
            ParamGuards.isNumericArrayParamConfig(newConfig)
        ) {
            if (intentions?.range) {
                const [min, max] = intentions.range;
                if (newConfig.min === NumberParamConfigDefaults.min) newConfig.min = min;
                if (newConfig.max === NumberParamConfigDefaults.max) newConfig.max = max;
            }
            if (intentions?.step && newConfig.step === NumberParamConfigDefaults.step)
                newConfig.step = intentions.step;
        }

        // If we're parsing a shader, assign value tokens for supported param types
        if (mode === InferenceMode.ShaderFile) {
            // Assign number value tokens
            if (ParamGuards.isNumberParamConfig(newConfig)) {
                if (intentions?.numberValues?.length) value = Number(intentions.numberValues[0]);
            }

            // Assign boolean value tokens
            if (ParamGuards.isBooleanParamConfig(newConfig)) {
                if (intentions?.booleanValues?.length) value = intentions.booleanValues[0];
            }

            // Assign numeric array value tokens
            if (ParamGuards.isNumericArrayParamConfig(newConfig)) {
                if (intentions?.numericArrayValues?.length) {
                    value = intentions.numericArrayValues[0];
                }
            }
        }

        // todo: infer styles from stringTokens and the parameter key
        console.log(intentions?.potentialStyleStrings);

        return {
            config: newConfig,
            value: value
        };
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
