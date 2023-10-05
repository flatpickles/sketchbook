import type { ParamConfig } from '../ConfigModels/ParamConfig';
import { NumberParamConfigDefaults } from '../ConfigModels/ParamConfigs/NumberParamConfig';
import type { AnyParamValueType } from '../ConfigModels/ParamTypes';
import { ParamGuards } from '../ConfigModels/ParamTypes';

type Inference = {
    config: ParamConfig;
    value?: AnyParamValueType;
};

type Intentions = {
    name?: string;
    range?: [number, number];
    step?: number;
    booleanValues?: boolean[];
    numberValues?: number[];
    numericArrayValues?: number[][];
    potentialStyleStrings?: string[];
};

export type InferenceReturn = {
    configs: ParamConfig[];
    values: Record<string, unknown>;
};

export enum InferenceMode {
    ProjectFile,
    ShaderFile
}

export default class ParamInference {
    static paramsWithInference(
        initialConfigs: ParamConfig[],
        rawFileText: string,
        mode: InferenceMode
    ): InferenceReturn {
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
            const inference = this.supplementConfig(config, mode, comment ? comment[1] : '');
            supplementedConfigs.push(inference.config);
            if (inference.value !== undefined) valueMap[config.key] = inference.value;
        }
        return {
            configs: supplementedConfigs,
            values: valueMap
        };
    }

    static supplementConfig(
        initialConfig: ParamConfig,
        mode: InferenceMode,
        comment?: string
    ): Inference {
        // Fill out a config and value with inferred values, if available
        const newConfig = { ...initialConfig };
        let value: AnyParamValueType | undefined;
        const intentions = comment ? this.intentionsFrom(comment) : {};

        // Assign name token
        if (intentions.name && newConfig.name === newConfig.key) {
            newConfig.name = intentions.name;
        }

        // Assign range and step tokens for numeric param types
        if (
            ParamGuards.isNumberParamConfig(newConfig) ||
            ParamGuards.isNumericArrayParamConfig(newConfig)
        ) {
            if (intentions.range) {
                const [min, max] = intentions.range;
                if (newConfig.min === NumberParamConfigDefaults.min) newConfig.min = min;
                if (newConfig.max === NumberParamConfigDefaults.max) newConfig.max = max;
            }
            if (intentions.step && newConfig.step === NumberParamConfigDefaults.step)
                newConfig.step = intentions.step;
        }

        // If we're parsing a shader, assign value tokens for supported param types
        if (mode === InferenceMode.ShaderFile) {
            // Assign number value tokens
            if (ParamGuards.isNumberParamConfig(newConfig)) {
                if (intentions.numberValues?.length) value = Number(intentions.numberValues[0]);
            }

            // Assign boolean value tokens
            if (ParamGuards.isBooleanParamConfig(newConfig)) {
                if (intentions.booleanValues?.length) value = intentions.booleanValues[0];
            }

            // Assign numeric array value tokens
            if (ParamGuards.isNumericArrayParamConfig(newConfig)) {
                if (intentions.numericArrayValues?.length) {
                    value = intentions.numericArrayValues[0];
                }
            }
        }

        // todo: infer styles from stringTokens and the parameter key
        console.log(intentions.potentialStyleStrings);

        return {
            config: newConfig,
            value: value
        };
    }

    static intentionsFrom(parseString: string): Intentions {
        // Collect tokens that match intention patterns
        const nameTokens = parseString.match(/"([^"]*)"/); // "Name"
        const rangeTokens = parseString.match(/(-?\d*\.{0,1}\d+)\s*to\s*(-?\d*\.{0,1}\d+)/);
        const stepTokens = parseString.match(/(step\s*\d*\.{0,1}\d+)|(\d*\.{0,1}\d+\s*step)/);
        const booleanTokens = parseString.match(/true|false/);
        const numberTokens = parseString.match(/(-?\d*\.{0,1}\d+)(?![^[]*])/);
        const numericArrayTokens = parseString.match(
            /\[(\s*-?\d*\.{0,1}\d+\s*,\s*)+(\s*-?\d*\.{0,1}\d+\s*)\]/
        );
        const potentialStyleTokens = parseString.match(/^[a-zA-Z]+/); // myString

        // Return an object with adapted tokens, if any
        const rangeMinMax = rangeTokens?.length ? rangeTokens[0].split(/\s*to\s*/) : undefined;
        return {
            name: nameTokens?.length ? nameTokens[0].replace(/"/g, '').trim() : undefined,
            range: rangeMinMax ? [Number(rangeMinMax[0]), Number(rangeMinMax[1])] : undefined,
            step: stepTokens?.length
                ? Number(stepTokens[0].replace(/step/g, '').trim())
                : undefined,
            booleanValues: booleanTokens?.length
                ? booleanTokens.map((bool) => bool === 'true')
                : undefined,
            numberValues: numberTokens?.length ? numberTokens.map((num) => Number(num)) : undefined,
            numericArrayValues: numericArrayTokens?.length
                ? numericArrayTokens.map((arrayString) =>
                      arrayString
                          .replace(/\[|\]/g, '')
                          .split(/\s*,\s*/)
                          .map((x) => Number(x))
                  )
                : undefined,
            potentialStyleStrings: potentialStyleTokens?.length ? potentialStyleTokens : undefined
        };
    }
}
