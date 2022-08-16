import passport from 'passport';
import passportJwt, { Strategy } from 'passport-jwt';
import { IUserRepository } from '../../../repositories/interfaces/IUserRepository';
import { TokenPayload } from '../../../useCases/User/SignIn/TokenGenerator';

export class Passport {
  private strategy: Strategy;

  constructor(private repository: IUserRepository, private secretKey: string) {
    const { Strategy, ExtractJwt } = passportJwt;

    const params = {
      secretOrKey: this.secretKey,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    };

    this.strategy = new Strategy(
      params,
      async (payload: TokenPayload, done) => {
        try {
          await this.repository.findById(payload.id);
          done(null, { ...payload });
        } catch (error) {
          done(error, false);
        }
      },
    );
  }

  handle() {
    passport.use(this.strategy);
    return passport.authenticate('jwt', { session: false });
  }
}
