import type { ParamConfig } from '../ConfigModels/ParamConfig';
import { NumberParamConfigDefaults } from '../ConfigModels/ParamConfigs/NumberParamConfig';
import type { AnyParamValueType } from '../ConfigModels/ParamTypes';
import { ParamGuards } from '../ConfigModels/ParamTypes';

type Inference = {
    config: ParamConfig;
    value?: AnyParamValueType;
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
            const inference = this.#getInference(config, mode, comment ? comment[1] : '');
            supplementedConfigs.push(inference.config);
            if (inference.value !== undefined) valueMap[config.key] = inference.value;
        }
        return {
            configs: supplementedConfigs,
            values: valueMap
        };
    }

    static #getInference(
        initialConfig: ParamConfig,
        mode: InferenceMode,
        comment?: string
    ): Inference {
        // Collect tokens that match a variety of patterns
        const commentTokens = comment ? comment.split(/,(?![^[]*])/) : []; // split by commas, not within brackets
        const nameToken = commentTokens.find((token) => token.match(/"([^"]*)"/)); // "Name"
        const rangeToken = commentTokens.find((token) => token.match(/(\d+)\s*to\s*(\d+)/)); // -1 to 3
        const stepToken = commentTokens.find((token) => token.match(/(step\s*\d+)|(\d+\s*step)/)); // step 0.5
        const booleanToken = commentTokens.find((token) => token.match(/true|false/)); // true
        const numberToken = commentTokens.find((token) => token.match(/^-?\d+(\.\d+)?$/)); // 3, 0.5, -18
        const numericArrayToken = commentTokens.find((token) =>
            token.match(/\[((-?\d+(?:\.\d+)?(?:\s*,\s*-?\d+(?:\.\d+)?)*)?)\]/)
        ); // [1, 2.0, -3]
        const stringTokens = commentTokens.filter((token) => token.match(/^[a-zA-Z0-9_]+$/)); // myString

        // Fill out a config and value with inferred values, if available
        const newConfig = { ...initialConfig };
        let value: AnyParamValueType | undefined;

        // Assign name token
        if (nameToken && newConfig.name === newConfig.key) {
            newConfig.name = nameToken.replace(/"/g, '');
        }

        // Assign range and step tokens for numeric param types
        if (
            ParamGuards.isNumberParamConfig(newConfig) ||
            ParamGuards.isNumericArrayParamConfig(newConfig)
        ) {
            if (rangeToken) {
                const [min, max] = rangeToken.split(/\s*to\s*/);
                if (newConfig.min === NumberParamConfigDefaults.min) newConfig.min = Number(min);
                if (newConfig.max === NumberParamConfigDefaults.max) newConfig.max = Number(max);
            }
            if (stepToken) {
                const stepValue = Number(stepToken.replace(/step/g, '').trim());
                if (newConfig.step === NumberParamConfigDefaults.step) newConfig.step = stepValue;
            }
        }

        // If we're parsing a shader, assign value tokens for supported param types
        if (mode === InferenceMode.ShaderFile) {
            // Assign number value tokens
            if (ParamGuards.isNumberParamConfig(newConfig)) {
                if (numberToken) value = Number(numberToken);
            }

            // Assign boolean value tokens
            if (ParamGuards.isBooleanParamConfig(newConfig)) {
                if (booleanToken) value = booleanToken === 'true';
            }

            // Assign numeric array value tokens
            if (ParamGuards.isNumericArrayParamConfig(newConfig)) {
                if (numericArrayToken) {
                    const arrayString = numericArrayToken.replace(/\[|\]/g, '');
                    const arrayValues = arrayString.split(/\s*,\s*/).map((x) => Number(x));
                    value = arrayValues;
                }
            }
        }

        // todo: infer styles from stringTokens and the parameter key
        console.log(stringTokens);

        return {
            config: newConfig,
            value: value
        };
    }
}
